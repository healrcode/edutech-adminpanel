import React from 'react';
import { Chip, ChipProps } from '@mui/material';
import { CourseLevel } from '../../../common/enums';

interface LevelBadgeProps {
    level: CourseLevel;
}

export default function LevelBadge({ level }: LevelBadgeProps) {
    const getLevelColor = (): ChipProps['color'] => {
        switch (level) {
            case CourseLevel.BEGINNER:
                return 'info';
            case CourseLevel.INTERMEDIATE:
                return 'success';
            case CourseLevel.ADVANCED:
                return 'warning';
            case CourseLevel.EXPERT:
                return 'error';
            default:
                return 'default';
        }
    };

    const getLevelLabel = (): string => {
        switch (level) {
            case CourseLevel.BEGINNER:
                return 'Beginner';
            case CourseLevel.INTERMEDIATE:
                return 'Intermediate';
            case CourseLevel.ADVANCED:
                return 'Advanced';
            case CourseLevel.EXPERT:
                return 'Expert';
            default:
                return level;
        }
    };

    return (
        <Chip
            label={getLevelLabel()}
            color={getLevelColor()}
            size="small"
            variant="outlined"
        />
    );
}
