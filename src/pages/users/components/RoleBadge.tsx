import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface RoleBadgeProps {
  role: string;
}

const getRoleColor = (role: string): ChipProps['color'] => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'error';
    case 'instructor':
      return 'primary';
    case 'student':
      return 'info';
    default:
      return 'default';
  }
};

const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  return (
    <Chip
      label={role.charAt(0).toUpperCase() + role.slice(1)}
      color={getRoleColor(role)}
      size="small"
      variant="outlined"
    />
  );
};

export default RoleBadge;
