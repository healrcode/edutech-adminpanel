import React, { useState, useEffect } from 'react';
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
import { courseApi, Course, UpdateCourseInput } from '../../../api/courses';
import { CourseLevel, Status } from '../../../common/enums';

interface EditCourseDrawerProps {
    open: boolean;
    course: Course;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditCourseDrawer({ open, course, onClose, onSuccess }: EditCourseDrawerProps) {
    const [formData, setFormData] = useState<UpdateCourseInput>({
        title: course.title,
        description: course.description,
        level: course.level,
        objectives: [...course.objectives],
        requirements: [...course.requirements],
        duration: course.duration,
        status: course.status,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Update form data when course changes
        setFormData({
            title: course.title,
            description: course.description,
            level: course.level,
            objectives: [...course.objectives],
            requirements: [...course.requirements],
            duration: course.duration,
            status: course.status,
        });
    }, [course]);

    const handleChange = (field: keyof UpdateCourseInput, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleArrayChange = (field: 'objectives' | 'requirements', index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field]?.map((item, i) => i === index ? value : item) || []
        }));
    };

    const handleAddArrayItem = (field: 'objectives' | 'requirements') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), '']
        }));
    };

    const handleRemoveArrayItem = (field: 'objectives' | 'requirements', index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field]?.filter((_, i) => i !== index) || []
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            // Filter out empty array items
            const cleanedData = {
                ...formData,
                objectives: formData.objectives?.filter(obj => obj.trim()) || [],
                requirements: formData.requirements?.filter(req => req.trim()) || []
            };
            await courseApi.updateCourse(course.id, cleanedData);
            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Failed to update course:', error);
            // TODO: Show error snackbar
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
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
                    <Typography variant="h6">Edit Course</Typography>
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
                        select
                        label="Status"
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        fullWidth
                        required
                    >
                        {Object.values(Status).map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
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
                        {formData.objectives?.map((objective, index) => (
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
                        {formData.requirements?.map((requirement, index) => (
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
                            Update Course
                        </Button>
                    </Box>
                </Stack>
            </Box>
        </Drawer>
    );
}
