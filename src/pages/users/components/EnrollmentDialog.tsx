import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Stack,
  Box,
  Chip,
  Alert,
  Skeleton,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { User } from "../../../store/types";
import { enrollmentsApi, Enrollment, Course } from "../../../api/enrollments";

interface EnrollmentDialogProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
}

const EnrollmentDialog: React.FC<EnrollmentDialogProps> = ({
  open,
  onClose,
  user,
}) => {
  const [issuingCertificate, setIssuingCertificate] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [enrolling, setEnrolling] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const enrollmentColumns: GridColDef[] = [
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


  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !open) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [enrollments, courses] = await Promise.all([
          enrollmentsApi.getActiveEnrollments(user.id),
          enrollmentsApi.getAvailableCourses()
        ]);
        
        // Add null checks and default to empty arrays
        setEnrollments(enrollments?.data || []);
        setAvailableCourses(courses?.data || []);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, open]);

  const handleEnrollUser = async () => {
    if (!user || !selectedCourse) return;

    setEnrolling(true);
    try {
      await enrollmentsApi.enrollUserInCourse(user.id, selectedCourse);
      const enrollments = await enrollmentsApi.getActiveEnrollments(user.id);
      setEnrollments(enrollments?.data || []);
      setSelectedCourse("");
      setError(null);
    } catch (error: any) {
      console.error("Error enrolling user:", error);
      setError(error.message || "Failed to enroll user in course");
    } finally {
      setEnrolling(false);
    }
  };

  const handleIssueCertificate = async (enrollmentId: string) => {
    if (!user) return;
    
    setIssuingCertificate(enrollmentId);
    try {
      await enrollmentsApi.issueCertificate(enrollmentId);
      const enrollments = await enrollmentsApi.getActiveEnrollments(user.id);
      setEnrollments(enrollments?.data || []);
      setError(null);
    } catch (error: any) {
      console.error("Error issuing certificate:", error);
      setError(error.message || "Failed to issue certificate");
    } finally {
      setIssuingCertificate(null);
    }
  };

  return !user ? null : (
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
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Enroll in Course Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Enroll in Course
            </Typography>
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Select Course"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                sx={{ minWidth: 300 }}
              >
              {availableCourses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name}
                </MenuItem>
              ))}
              </TextField>
              <Button
                variant="contained"
                startIcon={enrolling ? <CircularProgress size={20} /> : <AddIcon />}
                onClick={handleEnrollUser}
                disabled={!selectedCourse || enrolling}
              >
                {enrolling ? "Enrolling..." : "Enroll"}
              </Button>
            </Stack>
          </Box>

          <Divider />

          {/* Current Enrollments Section */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Current Enrollments
            </Typography>
            {isLoading ? (
              <Box sx={{ p: 2 }}>
                {[...Array(3)].map((_, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Skeleton variant="rectangular" height={40} />
                  </Box>
                ))}
              </Box>
            ) : (
              <DataGrid
                rows={enrollments}
                columns={enrollmentColumns}
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
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentDialog;
