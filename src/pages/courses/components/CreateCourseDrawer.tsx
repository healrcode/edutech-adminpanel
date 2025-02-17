import React, { useState } from 'react';
import {
    Box,
    Button,
    Drawer,
    IconButton,
    TextField,
    Typography,
    MenuItem,
    Stack,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { courseApi, CreateCourseInput } from '../../../api/courses';
import { CourseLevel } from '../../../common/enums';

interface CreateCourseDrawerProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const initialFormData: CreateCourseInput = {
    title: '',
    description: '',
    level: CourseLevel.BEGINNER,
    objectives: [''],
    requirements: [''],
    duration: undefined,
};

export default function CreateCourseDrawer({ open, onClose, onSuccess }: CreateCourseDrawerProps) {
    const [formData, setFormData] = useState<CreateCourseInput>(initialFormData);
    const [loading, setLoading] = useState(false);

    const handleChange = (field: keyof CreateCourseInput, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayChange = (field: 'objectives' | 'requirements', index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    const handleAddArrayItem = (field: 'objectives' | 'requirements') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const handleRemoveArrayItem = (field: 'objectives' | 'requirements', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            // Filter out empty array items
            const cleanedData = {
                ...formData,
                objectives: formData.objectives.filter(obj => obj.trim()),
                requirements: formData.requirements.filter(req => req.trim())
            };
            await courseApi.createCourse(cleanedData);
            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Failed to create course:', error);
            // TODO: Show error snackbar
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData(initialFormData);
        onClose();
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            PaperProps={{
                sx: { width: '500px' }
            }}
        >
            <Box p={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6">Create Course</Typography>
                    <IconButton onClick={handleClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Stack spacing={3}>
                    <TextField
                        label="Title"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        fullWidth
                        required
                    />

                    <TextField
                        label="Description"
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        required
                    />

                    <TextField
                        select
                        label="Level"
                        value={formData.level}
                        onChange={(e) => handleChange('level', e.target.value)}
                        fullWidth
                        required
                    >
                        {Object.values(CourseLevel).map((level) => (
                            <MenuItem key={level} value={level}>
                                {level}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        label="Duration (minutes)"
                        type="number"
                        value={formData.duration || ''}
                        onChange={(e) => handleChange('duration', parseInt(e.target.value) || undefined)}
                        fullWidth
                    />

                    <Box>
                        <Typography variant="subtitle2" mb={1}>Objectives</Typography>
                        {formData.objectives.map((objective, index) => (
                            <Box key={index} display="flex" gap={1} mb={1}>
                                <TextField
                                    value={objective}
                                    onChange={(e) => handleArrayChange('objectives', index, e.target.value)}
                                    fullWidth
                                    placeholder={`Objective ${index + 1}`}
                                />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleRemoveArrayItem('objectives', index)}
                                >
                                    Remove
                                </Button>
                            </Box>
                        ))}
                        <Button onClick={() => handleAddArrayItem('objectives')}>
                            Add Objective
                        </Button>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" mb={1}>Requirements</Typography>
                        {formData.requirements.map((requirement, index) => (
                            <Box key={index} display="flex" gap={1} mb={1}>
                                <TextField
                                    value={requirement}
                                    onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                                    fullWidth
                                    placeholder={`Requirement ${index + 1}`}
                                />
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleRemoveArrayItem('requirements', index)}
                                >
                                    Remove
                                </Button>
                            </Box>
                        ))}
                        <Button onClick={() => handleAddArrayItem('requirements')}>
                            Add Requirement
                        </Button>
                    </Box>

                    <Box display="flex" gap={2} justifyContent="flex-end">
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            Create Course
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Drawer>
    );
}
