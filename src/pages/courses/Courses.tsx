import React, { useEffect, useState } from 'react';
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
            const data = await courseApi.getAllCourses();
            setCourses(data || []);
        } catch (error) {
            console.error('Failed to load courses:', error);
            setCourses([]); // Set empty array on error
            // TODO: Show error snackbar
        } finally {
            setLoading(false);
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
        return <div>Loading...</div>; // TODO: Add proper loading component
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
                            <TableRow key={course.id}>
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
                                        onClick={() => handleEditCourse(course)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDeleteCourse(course.id)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    {course.status === Status.DRAFT && (
                                        <Button
                                            size="small"
                                            onClick={() => handlePublishCourse(course.id)}
                                        >
                                            Publish
                                        </Button>
                                    )}
                                    {course.status === Status.PUBLISHED && (
                                        <Button
                                            size="small"
                                            onClick={() => handleUnpublishCourse(course.id)}
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
