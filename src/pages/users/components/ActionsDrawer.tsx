import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { Role, UserStatus } from '../../../common/enums';
import { User } from '../../../store/types';

interface ActionsDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onStatusUpdate: (userId: string, status: UserStatus) => void;
  onRoleUpdate: (userId: string, role: Role) => void;
  onDelete: (userId: string) => void;
}

const ActionsDrawer: React.FC<ActionsDrawerProps> = ({
  open,
  onClose,
  user,
  onStatusUpdate,
  onRoleUpdate,
  onDelete
}) => {
  const [selectedRole, setSelectedRole] = React.useState<Role | ''>('');
  const [selectedStatus, setSelectedStatus] = React.useState<UserStatus | ''>('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setSelectedRole(user.role as Role);
      setSelectedStatus(user.status as UserStatus);
    }
  }, [user]);

  const handleUpdateRole = () => {
    if (user && selectedRole) {
      onRoleUpdate(user.id, selectedRole);
      onClose();
    }
  };

  const handleUpdateStatus = () => {
    if (user && selectedStatus) {
      onStatusUpdate(user.id, selectedStatus);
      onClose();
    }
  };

  const handleDelete = () => {
    if (user) {
      onDelete(user.id);
      setIsDeleteDialogOpen(false);
      onClose();
    }
  };

  if (!user) return null;

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { width: 320 }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              User Actions
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Stack spacing={3}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                User Details
              </Typography>
              <Typography variant="body2">
                {user.email}
              </Typography>
              <Typography variant="body2">
                {`${user.firstName || ''} ${user.lastName || ''}`.trim() || '-'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Role Management
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  value={selectedRole}
                  label="Role"
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                >
                  {Object.values(Role).map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button 
                variant="outlined" 
                fullWidth
                onClick={handleUpdateRole}
                disabled={selectedRole === user.role}
              >
                Update Role
              </Button>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Status Management
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 1 }}>
                <InputLabel id="status-select-label">Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  value={selectedStatus}
                  label="Status"
                  onChange={(e) => setSelectedStatus(e.target.value as UserStatus)}
                >
                  {Object.values(UserStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button 
                variant="outlined" 
                fullWidth
                onClick={handleUpdateStatus}
                disabled={selectedStatus === user.status}
              >
                Update Status
              </Button>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Danger Zone
              </Typography>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<DeleteIcon />}
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete User
              </Button>
            </Box>
          </Stack>
        </Box>
      </Drawer>

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>
          Delete User
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ActionsDrawer;
