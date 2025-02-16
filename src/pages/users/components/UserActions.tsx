import React from 'react';
import { Button, Menu, MenuItem, IconButton } from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { User } from '../../../store/types';

interface UserActionsProps {
  user: User;
  onStatusUpdate: (userId: string, status: string) => void;
  onRoleUpdate: (userId: string, role: string) => void;
}

const STATUSES = ['active', 'inactive', 'suspended'];
const ROLES = ['student', 'instructor', 'admin'];

const UserActions: React.FC<UserActionsProps> = ({
  user,
  onStatusUpdate,
  onRoleUpdate
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [menuType, setMenuType] = React.useState<'status' | 'role' | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>, type: 'status' | 'role') => {
    setAnchorEl(event.currentTarget);
    setMenuType(type);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setMenuType(null);
  };

  const handleStatusSelect = (status: string) => {
    onStatusUpdate(user.id, status);
    handleClose();
  };

  const handleRoleSelect = (role: string) => {
    onRoleUpdate(user.id, role);
    handleClose();
  };

  return (
    <>
      <Button
        size="small"
        onClick={(e) => handleClick(e, 'status')}
        sx={{ mr: 1 }}
      >
        Status
      </Button>
      <Button
        size="small"
        onClick={(e) => handleClick(e, 'role')}
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
