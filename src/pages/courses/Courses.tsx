import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { courseApi, Course } from '../../api/courses';
import { CourseLevel, Status } from '../../common/enums';

// Components to be created next
import StatusBadge from './components/StatusBadge';
import LevelBadge from './components/LevelBadge';
import CreateCourseDrawer from './components/CreateCourseDrawer';
import EditCourseDrawer from './components/EditCourseDrawer';

import Layout from '../../components/layout/Layout';

export default function Courses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
    const [editDrawerOpen, setEditDrawerOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            console.log('Fetching courses...');
            const data = await courseApi.getAllCourses();
            console.log('Raw courses data:', data);
            
            // Validate course data structure
            if (Array.isArray(data)) {
                // Log each course's data
                data.forEach((course, index) => {
                    console.log(`Course ${index + 1}:`, {
                        id: course.id,
                        title: course.title,
                        level: course.level,
                        status: course.status,
                        hasObjectives: Array.isArray(course.objectives),
                        hasRequirements: Array.isArray(course.requirements),
                        teacherId: course.teacherId,
                        duration: course.duration
                    });
                });
                
                setCourses(data);
                console.log('Courses state updated with', data.length, 'courses');
            } else {
                console.error('Invalid courses data format:', data);
                setCourses([]);
            }
        } catch (error) {
            console.error('Failed to load courses:', error);
            if (error instanceof Error) {
                console.error('Error details:', {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                });
            }
            setCourses([]);
        } finally {
            setLoading(false);
            console.log('Loading state set to false');
        }
    };

    const handleCreateCourse = async () => {
        setCreateDrawerOpen(true);
    };

    const handleEditCourse = (course: Course) => {
        setSelectedCourse(course);
        setEditDrawerOpen(true);
    };

    const handleDeleteCourse = async (courseId: string) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await courseApi.deleteCourse(courseId);
                await loadCourses(); // Refresh list
                // TODO: Show success snackbar
            } catch (error) {
                console.error('Failed to delete course:', error);
                // TODO: Show error snackbar
            }
        }
    };

    const handlePublishCourse = async (courseId: string) => {
        try {
            await courseApi.publishCourse(courseId);
            await loadCourses(); // Refresh list
            // TODO: Show success snackbar
        } catch (error) {
            console.error('Failed to publish course:', error);
            // TODO: Show error snackbar
        }
    };

    const handleUnpublishCourse = async (courseId: string) => {
        try {
            await courseApi.unpublishCourse(courseId);
            await loadCourses(); // Refresh list
            // TODO: Show success snackbar
        } catch (error) {
            console.error('Failed to unpublish course:', error);
            // TODO: Show error snackbar
        }
    };

    if (loading) {
        console.log('Rendering loading state');
        return (
            <Layout>
                <Box p={3} display="flex" justifyContent="center">
                    <Typography>Loading courses...</Typography>
                </Box>
            </Layout>
        );
    }

    console.log('Rendering courses table. State:', {
        loading,
        coursesLength: courses.length,
        isEmpty: courses.length === 0,
        firstCourse: courses[0] ? {
            id: courses[0].id,
            title: courses[0].title,
            level: courses[0].level,
            status: courses[0].status
        } : null
    });

    // Add empty state message
    if (courses.length === 0) {
        return (
            <Layout>
                <Box p={3}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h5">Courses</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleCreateCourse}
                        >
                            Create Course
                        </Button>
                    </Box>
                    <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="textSecondary">
                            No courses found. Click the Create Course button to add one.
                        </Typography>
                    </Paper>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Box p={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5">Courses</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={handleCreateCourse}
                    >
                        Create Course
                    </Button>
                </Box>

                <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Duration</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {courses.map((course) => (
                            <TableRow 
                                key={course.id}
                                onClick={() => navigate(`/courses/${course.id}`)}
                                sx={{ 
                                    cursor: 'pointer',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                }}
                            >
                                <TableCell>{course.title}</TableCell>
                                <TableCell>
                                    <LevelBadge level={course.level} />
                                </TableCell>
                                <TableCell>
                                    <StatusBadge status={course.status} />
                                </TableCell>
                                <TableCell>
                                    {course.duration ? `${course.duration} minutes` : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditCourse(course);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCourse(course.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    {course.status === Status.DRAFT && (
                                        <Button
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePublishCourse(course.id);
                                            }}
                                        >
                                            Publish
                                        </Button>
                                    )}
                                    {course.status === Status.PUBLISHED && (
                                        <Button
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUnpublishCourse(course.id);
                                            }}
                                        >
                                            Unpublish
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </TableContainer>

                {/* Drawers */}
                <CreateCourseDrawer
                    open={createDrawerOpen}
                    onClose={() => setCreateDrawerOpen(false)}
                    onSuccess={() => {
                        setCreateDrawerOpen(false);
                        loadCourses();
                    }}
                />

                {selectedCourse && (
                    <EditCourseDrawer
                        open={editDrawerOpen}
                        course={selectedCourse}
                        onClose={() => {
                            setEditDrawerOpen(false);
                            setSelectedCourse(null);
                        }}
                        onSuccess={() => {
                            setEditDrawerOpen(false);
                            setSelectedCourse(null);
                            loadCourses();
                        }}
                    />
                )}
            </Box>
        </Layout>
    );
}
