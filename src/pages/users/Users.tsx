import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Alert,
  Skeleton,
  Snackbar,
  Avatar,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  DataGrid, 
  GridColDef
} from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import Layout from '../../components/layout/Layout';
import { usersApi } from '../../api/users';
import { User } from '../../store/types';
import UserActions from './components/UserActions';
import StatusBadge from './components/StatusBadge';
import RoleBadge from './components/RoleBadge';

interface AlertState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'success'
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [totalRows, setTotalRows] = useState(0);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = useCallback(async (search?: string) => {
    if (!pageLoaded || search !== undefined) {
      try {
        console.log('[Users] Fetching users:', {
          page: paginationModel.page + 1,
          pageSize: paginationModel.pageSize,
          search: search || searchQuery,
          hasToken: !!localStorage.getItem('accessToken')
        });
        setError(null);
        setIsLoading(true);
        const response = await usersApi.list({
          page: paginationModel.page + 1,
          pageSize: paginationModel.pageSize,
          search: search || searchQuery
        });
        console.log('[Users] Users fetched successfully:', {
          count: response.data?.length || 0,
          total: response.total || 0
        });
        setUsers(response.data || []);
        setTotalRows(response.total || 0);
        setPageLoaded(true);
      } catch (error: any) {
        console.error('[Users] Error fetching users:', {
          error,
          status: error.response?.status,
          message: error.message,
          hasToken: !!localStorage.getItem('accessToken')
        });
        setError(error.message || 'Failed to fetch users. Please try again later.');
        setUsers([]);
        setTotalRows(0);
      } finally {
        setIsLoading(false);
      }
    }
  }, [paginationModel, pageLoaded, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showAlert = (message: string, severity: 'success' | 'error') => {
    setAlert({
      open: true,
      message,
      severity
    });
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({ ...prev, open: false }));
  };

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      await usersApi.updateStatus(userId, newStatus);
      setPageLoaded(false); // Trigger refetch
      showAlert(`User status updated to ${newStatus}`, 'success');
    } catch (error: any) {
      console.error('Error updating user status:', error);
      showAlert(error.message || 'Failed to update user status', 'error');
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await usersApi.updateRole(userId, newRole);
      setPageLoaded(false); // Trigger refetch
      showAlert(`User role updated to ${newRole}`, 'success');
    } catch (error: any) {
      console.error('Error updating user role:', error);
      showAlert(error.message || 'Failed to update user role', 'error');
    }
  };

  const handlePaginationModelChange = (newModel: any) => {
    setPaginationModel(newModel);
    setPageLoaded(false); // Trigger refetch for new page
  };

  const handleSearch = () => {
    setPageLoaded(false);
    fetchUsers(searchQuery);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const columns: GridColDef[] = [
    { 
      field: 'avatar',
      headerName: '',
      width: 60,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const user = params.row as User;
        return (
          <Avatar 
            src={user.avatar} 
            alt={`${user.firstName} ${user.lastName}`.trim() || user.email}
            sx={{ width: 32, height: 32 }}
          />
        );
      }
    },
    { 
      field: 'email', 
      headerName: 'Email', 
      flex: 1,
      minWidth: 200
    },
    { 
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const user = params.row as User;
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        return `${firstName} ${lastName}`.trim() || '-';
      }
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 130,
      renderCell: (params) => (
        <RoleBadge role={params.row.role} />
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 130,
      renderCell: (params) => (
        <StatusBadge status={params.row.status} />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <UserActions
          user={params.row as User}
          onStatusUpdate={handleStatusUpdate}
          onRoleUpdate={handleRoleUpdate}
        />
      ),
    },
  ];

  return (
    <Layout>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ p: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Typography variant="h4">
                Users
              </Typography>
              <TextField
                placeholder="Search users..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        onClick={handleSearch}
                        edge="end"
                        aria-label="search"
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ width: 300 }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Paper>
              {isLoading && users.length === 0 && (
                <Box sx={{ p: 2 }}>
                  {[...Array(3)].map((_, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Skeleton variant="rectangular" height={40} />
                    </Box>
                  ))}
                </Box>
              )}
              {(users.length > 0 || !isLoading) && (
                <DataGrid
                  rows={users}
                  columns={columns}
                  paginationModel={paginationModel}
                  onPaginationModelChange={handlePaginationModelChange}
                  loading={isLoading}
                  paginationMode="server"
                  rowCount={totalRows}
                  pageSizeOptions={[10, 25, 50]}
                  disableRowSelectionOnClick
                  autoHeight
                  sx={{ 
                    minHeight: 400,
                    '& .MuiDataGrid-root': {
                      border: 'none',
                    }
                  }}
                />
              )}
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Users;
