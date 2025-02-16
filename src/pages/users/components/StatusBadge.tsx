import React from 'react';
import { Chip, ChipProps } from '@mui/material';

interface StatusBadgeProps {
  status: string;
}

const getStatusColor = (status: string): ChipProps['color'] => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'default';
    case 'suspended':
      return 'error';
    default:
      return 'default';
  }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={getStatusColor(status)}
      size="small"
      variant="outlined"
    />
  );
};

export default StatusBadge;
