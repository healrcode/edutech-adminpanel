import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack
} from '@mui/material';
import { 
  DataGrid, 
  GridColDef, 
  GridRenderCellParams
} from '@mui/x-data-grid';
import Layout from '../../components/layout/Layout';
import { adminClient } from '../../api/admin/client';
import { User } from '../../store/types';
import UserActions from './components/UserActions';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [paginationModel]);

  const fetchUsers = async () => {
    try {
      const response = await adminClient.listUsers(
        paginationModel.page + 1,
        paginationModel.pageSize
      );
      setUsers(response.data);
      setTotalRows(response.total);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      await adminClient.updateUserStatus(userId, newStatus);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await adminClient.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', flex: 1 },
    { 
      field: 'name',
      headerName: 'Name',
      flex: 1,
      renderCell: (params) => {
        const user = params.row as User;
        const firstName = user.firstName || '';
        const lastName = user.lastName || '';
        return `${firstName} ${lastName}`.trim() || '-';
      }
    },
    { field: 'role', headerName: 'Role', width: 120 },
    { field: 'status', headerName: 'Status', width: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
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
      <Container maxWidth="xl">
        <Stack spacing={3} sx={{ p: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Users
            </Typography>

            <Paper>
              <DataGrid
                rows={users}
                columns={columns}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                loading={loading}
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
            </Paper>
          </Box>
        </Stack>
      </Container>
    </Layout>
  );
};

export default Users;
