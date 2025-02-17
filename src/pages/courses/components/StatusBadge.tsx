import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { Status } from '../../../common/enums';

interface StatusBadgeProps {
    status: Status;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStatusColor = (): ChipProps['color'] => {
        switch (status) {
            case Status.PUBLISHED:
                return 'success';
            case Status.DRAFT:
                return 'warning';
            case Status.ARCHIVED:
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (): string => {
        switch (status) {
            case Status.PUBLISHED:
                return 'Published';
            case Status.DRAFT:
                return 'Draft';
            case Status.ARCHIVED:
                return 'Archived';
            default:
                return status;
        }
    };

    return (
        <Chip
            label={getStatusLabel()}
            color={getStatusColor()}
            size="small"
            variant="outlined"
        />
    );
}
