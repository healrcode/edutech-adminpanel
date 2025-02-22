import React from 'react';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Chip,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { Course } from '../../../api/courses';
import LevelBadge from './LevelBadge';
import StatusBadge from './StatusBadge';

interface CourseInfoProps {
    course: Course;
}

export default function CourseInfo({ course }: CourseInfoProps) {
    return (
        <Box>
            <Grid container spacing={3}>
                {/* Basic Info */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Basic Information
                            </Typography>
                            <Box display="flex" gap={1} mb={2}>
                                <LevelBadge level={course.level} />
                                <StatusBadge status={course.status} />
                            </Box>
                            <Typography variant="body1" paragraph>
                                {course.description}
                            </Typography>
                            {course.duration && (
                                <Typography variant="body2" color="textSecondary">
                                    Duration: {course.duration} minutes
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Objectives */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Learning Objectives
                            </Typography>
                            <List>
                                {course.objectives.map((objective, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={objective} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Requirements */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Requirements
                            </Typography>
                            <List>
                                {course.requirements.map((requirement, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={requirement} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Additional Info */}
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Additional Information
                            </Typography>
                            <Box display="flex" flexDirection="column" gap={1}>
                                <Typography variant="body2">
                                    Created: {new Date(course.createdAt).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2">
                                    Last Updated: {new Date(course.updatedAt).toLocaleDateString()}
                                </Typography>
                                {course.thumbnail && (
                                    <Box mt={2}>
                                        <Typography variant="subtitle2" gutterBottom>
                                            Course Thumbnail
                                        </Typography>
                                        <img 
                                            src={course.thumbnail} 
                                            alt="Course thumbnail" 
                                            style={{ 
                                                maxWidth: '100%', 
                                                height: 'auto',
                                                borderRadius: '4px'
                                            }} 
                                        />
                                    </Box>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
