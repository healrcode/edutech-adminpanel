import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Tabs,
  Tab,
  Box,
  Chip,
  Alert,
  Skeleton,
  Grid,
  Paper,
  CircularProgress,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { User } from '../../../store/types';
import { enrollmentsApi, Enrollment } from '../../../api/enrollments';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`enrollment-tabpanel-${index}`}
      aria-labelledby={`enrollment-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface EnrollmentDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const EnrollmentDialog: React.FC<EnrollmentDialogProps> = ({
  open,
  onClose,
  user
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [issuingCertificate, setIssuingCertificate] = useState<string | null>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const activeEnrollmentColumns: GridColDef[] = [
    { 
      field: 'courseName', 
      headerName: 'Course', 
      flex: 1,
      minWidth: 200
    },
    { 
      field: 'enrollmentDate', 
      headerName: 'Enrolled On', 
      width: 150,
      valueFormatter: (params: { value: string }) => {
        return new Date(params.value).toLocaleDateString();
      }
    },
    {
      field: 'progress',
      headerName: 'Progress',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ width: '100%' }}>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            {params.value}%
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: 4,
              bgcolor: 'background.paper',
              borderRadius: 2,
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: `${params.value}%`,
                height: '100%',
                bgcolor: 'primary.main',
                borderRadius: 2,
                transition: 'width 0.3s ease-in-out',
              }}
            />
          </Box>
        </Box>
      )
    },
    {
      field: 'certificate',
      headerName: 'Certificate',
      width: 200,
      renderCell: (params) => {
        const enrollment = params.row as Enrollment;
        return params.value ? (
          <Chip 
            label="Issued" 
            color="success" 
            size="small" 
          />
        ) : enrollment.progress >= 100 ? (
          <Button
            variant="outlined"
            size="small"
            color="primary"
            onClick={() => handleIssueCertificate(enrollment.id)}
            disabled={issuingCertificate === enrollment.id}
            startIcon={issuingCertificate === enrollment.id ? <CircularProgress size={16} /> : null}
          >
            {issuingCertificate === enrollment.id ? 'Issuing...' : 'Issue Certificate'}
          </Button>
        ) : (
          <Chip 
            label="In Progress" 
            color="warning" 
            size="small" 
          />
        );
      }
    }
  ];

  const historyColumns: GridColDef[] = [
    { 
      field: 'courseName', 
      headerName: 'Course', 
      flex: 1,
      minWidth: 200
    },
    { 
      field: 'completedDate', 
      headerName: 'Completed On', 
      width: 150,
      valueFormatter: (params: { value: string }) => {
        return new Date(params.value).toLocaleDateString();
      }
    },
    {
      field: 'score',
      headerName: 'Score',
      width: 120,
      renderCell: (params) => (
        <Typography color={params.value >= 70 ? 'success.main' : 'error.main'}>
          {params.value}%
        </Typography>
      )
    },
    {
      field: 'certificate',
      headerName: 'Certificate',
      width: 150,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Issued' : 'Not Issued'} 
          color={params.value ? 'success' : 'default'} 
          size="small" 
        />
      )
    }
  ];

  const [activeEnrollments, setActiveEnrollments] = useState<Enrollment[]>([]);
  const [enrollmentHistory, setEnrollmentHistory] = useState<Enrollment[]>([]);
  const [stats, setStats] = useState<{
    totalEnrollments: number;
    completedCourses: number;
    averageProgress: number;
    averageScore: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && open) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const [activeRes, historyRes, statsRes] = await Promise.all([
            enrollmentsApi.getActiveEnrollments(user.id),
            enrollmentsApi.getEnrollmentHistory(user.id),
            enrollmentsApi.getEnrollmentStats(user.id)
          ]);

          setActiveEnrollments(activeRes.data.data);
          setEnrollmentHistory(historyRes.data.data);
          setStats(statsRes.data);
        } catch (error: any) {
          console.error('Error fetching enrollments:', error);
          setError(error.message || 'Failed to fetch enrollment data');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [user, open]);

  const handleIssueCertificate = async (enrollmentId: string) => {
    setIssuingCertificate(enrollmentId);
    try {
      await enrollmentsApi.issueCertificate(enrollmentId);
      // Refresh active enrollments
      if (user) {
        const response = await enrollmentsApi.getActiveEnrollments(user.id);
        setActiveEnrollments(response.data.data);
      }
      setError(null);
    } catch (error: any) {
      console.error('Error issuing certificate:', error);
      setError(error.message || 'Failed to issue certificate');
    } finally {
      setIssuingCertificate(null);
    }
  };

  if (!user) return null;

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={onClose}
    >
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">
            Course Enrollments - {user.firstName} {user.lastName}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Active Enrollments" />
          <Tab label="Enrollment History" />
          <Tab label="Analytics" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : isLoading ? (
            <Box sx={{ p: 2 }}>
              {[...Array(3)].map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton variant="rectangular" height={40} />
                </Box>
              ))}
            </Box>
          ) : (
            <DataGrid
              rows={activeEnrollments}
              columns={activeEnrollmentColumns}
              autoHeight
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 }
                }
              }}
            />
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : isLoading ? (
            <Box sx={{ p: 2 }}>
              {[...Array(3)].map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Skeleton variant="rectangular" height={40} />
                </Box>
              ))}
            </Box>
          ) : (
            <DataGrid
              rows={enrollmentHistory}
              columns={historyColumns}
              autoHeight
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 5 }
                }
              }}
            />
          )}
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : isLoading ? (
            <Box sx={{ p: 2 }}>
              <Skeleton variant="rectangular" height={200} />
            </Box>
          ) : stats ? (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Enrollments
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalEnrollments}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Completed Courses
                  </Typography>
                  <Typography variant="h4">
                    {stats.completedCourses}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Average Progress
                  </Typography>
                  <Typography variant="h4">
                    {stats.averageProgress}%
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Average Score
                  </Typography>
                  <Typography variant="h4" color={stats.averageScore >= 70 ? 'success.main' : 'error.main'}>
                    {stats.averageScore}%
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Typography>
              No analytics data available
            </Typography>
          )}
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentDialog;
