import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Button,
    Switch,
    FormControlLabel,
    Divider,
} from '@mui/material';
import { Course } from '../../../api/courses';
import { Status } from '../../../common/enums';

interface SettingsTabProps {
    course: Course;
    onPublish: () => void;
    onUnpublish: () => void;
    onArchive: () => void;
    onDelete: () => void;
}

export default function SettingsTab({
    course,
    onPublish,
    onUnpublish,
    onArchive,
    onDelete,
}: SettingsTabProps) {
    return (
        <Box>
            <Grid container spacing={3}>
                {/* Publishing Settings */}
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Publishing Settings
                            </Typography>
                            <Box mt={2}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Current Status: {course.status}
                                </Typography>
                                <Box mt={2} display="flex" gap={2}>
                                    {course.status === Status.DRAFT && (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={onPublish}
                                        >
                                            Publish Course
                                        </Button>
                                    )}
                                    {course.status === Status.PUBLISHED && (
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={onUnpublish}
                                        >
                                            Unpublish Course
                                        </Button>
                                    )}
                                    {course.status !== Status.ARCHIVED && (
                                        <Button
                                            variant="outlined"
                                            color="warning"
                                            onClick={onArchive}
                                        >
                                            Archive Course
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Danger Zone */}
                <Grid item xs={12}>
                    <Card sx={{ bgcolor: 'error.light' }}>
                        <CardContent>
                            <Typography variant="h6" color="error" gutterBottom>
                                Danger Zone
                            </Typography>
                            <Typography variant="body2" color="error.dark" paragraph>
                                Once you delete a course, there is no going back. Please be certain.
                            </Typography>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => {
                                    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
                                        onDelete();
                                    }
                                }}
                            >
                                Delete Course
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
