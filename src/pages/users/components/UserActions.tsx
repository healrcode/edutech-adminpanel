import React, { useState } from 'react';
import { 
  Button, 
  Menu, 
  MenuItem, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { User } from '../../../store/types';

interface UserActionsProps {
  user: User;
  onStatusUpdate: (userId: string, status: string) => void;
  onRoleUpdate: (userId: string, role: string) => void;
}

const STATUSES = ['active', 'inactive', 'suspended'];
const ROLES = ['student', 'instructor', 'admin'];

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false
}) => (
  <Dialog open={open} onClose={onCancel}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <DialogContentText>{message}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
      <Button onClick={onConfirm} color="primary" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : 'Confirm'}
      </Button>
    </DialogActions>
  </Dialog>
);

const UserActions: React.FC<UserActionsProps> = ({
  user,
  onStatusUpdate,
  onRoleUpdate
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuType, setMenuType] = useState<'status' | 'role' | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [loading, setLoading] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>, type: 'status' | 'role') => {
    setAnchorEl(event.currentTarget);
    setMenuType(type);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuType(null);
  };

  const handleStatusSelect = async (status: string) => {
    handleClose();
    setConfirmDialog({
      open: true,
      title: 'Update User Status',
      message: `Are you sure you want to change the user's status to ${status}?`,
      onConfirm: async () => {
        setLoading(true);
        try {
          await onStatusUpdate(user.id, status);
        } catch (error) {
          console.error('Failed to update status:', error);
        } finally {
          setLoading(false);
          setConfirmDialog(prev => ({ ...prev, open: false }));
        }
      },
    });
  };

  const handleRoleSelect = async (role: string) => {
    handleClose();
    setConfirmDialog({
      open: true,
      title: 'Update User Role',
      message: `Are you sure you want to change the user's role to ${role}?`,
      onConfirm: async () => {
        setLoading(true);
        try {
          await onRoleUpdate(user.id, role);
        } catch (error) {
          console.error('Failed to update role:', error);
        } finally {
          setLoading(false);
          setConfirmDialog(prev => ({ ...prev, open: false }));
        }
      },
    });
  };

  const handleCloseDialog = () => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={handleCloseDialog}
        loading={loading}
      />
      <Button
        size="small"
        onClick={(e) => handleClick(e, 'status')}
        sx={{ mr: 1 }}
        disabled={loading}
      >
        Status
      </Button>
      <Button
        size="small"
        onClick={(e) => handleClick(e, 'role')}
        disabled={loading}
      >
        Role
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {menuType === 'status' && STATUSES.map((status) => (
          <MenuItem
            key={status}
            onClick={() => handleStatusSelect(status)}
            selected={user.status === status}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </MenuItem>
        ))}
        
        {menuType === 'role' && ROLES.map((role) => (
          <MenuItem
            key={role}
            onClick={() => handleRoleSelect(role)}
            selected={user.role === role}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default UserActions;
