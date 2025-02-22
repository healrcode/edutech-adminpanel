import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Tab,
    Tabs,
    Typography,
    Paper,
    IconButton,
    Breadcrumbs,
    Link,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { courseApi, Course } from '../../api/courses';
import { ModuleType } from '../../common/enums';
import CourseInfo from './components/CourseInfo';
import ChaptersTab from './components/ChaptersTab';
import SettingsTab from './components/SettingsTab';
import Layout from '../../components/layout/Layout';

interface Module {
    id: string;
    title: string;
    type: ModuleType;
    description?: string;
    duration?: number;
    position: number;
    isRequired: boolean;
}

interface Chapter {
    id: string;
    title: string;
    description?: string;
    position: number;
    isOptional: boolean;
    isFree: boolean;
    modules: Module[];
}

interface ModuleFormData {
    title: string;
    description?: string;
    type: ModuleType;
    content: any;
    duration?: number;
    isRequired: boolean;
}

interface ChapterFormData {
    title: string;
    description?: string;
    isOptional: boolean;
    isFree: boolean;
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`course-tabpanel-${index}`}
            aria-labelledby={`course-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function CourseDetail() {
    const navigate = useNavigate();
    const { courseId } = useParams<{ courseId: string }>();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState(0);

    useEffect(() => {
        if (courseId) {
            loadCourseDetails(courseId);
        }
    }, [courseId]);

    const loadCourseDetails = async (id: string) => {
        try {
            setLoading(true);
            const course = await courseApi.getCourse(id);
            setSelectedCourse(course);
        } catch (error) {
            console.error('Failed to load course details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    if (loading) {
        return (
            <Layout>
                <Box p={3}>
                    <Typography>Loading course details...</Typography>
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Box p={3}>
                {/* Header with Breadcrumbs */}
                <Box mb={3} display="flex" alignItems="center" gap={2}>
                    <IconButton onClick={() => navigate('/courses')}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Breadcrumbs>
                        <Link 
                            component="button"
                            variant="body1" 
                            onClick={() => navigate('/courses')}
                            sx={{ textDecoration: 'none' }}
                        >
                            Courses
                        </Link>
                        <Typography color="text.primary">
                            {selectedCourse?.title}
                        </Typography>
                    </Breadcrumbs>
                </Box>

                {selectedCourse && (
                    <>
                        {/* Course Title and Info */}
                        <Box mb={3}>
                            <Typography variant="h4" gutterBottom>
                                {selectedCourse.title}
                            </Typography>
                            <Typography color="textSecondary">
                                {selectedCourse.description}
                            </Typography>
                        </Box>

                        {/* Tabs */}
                        <Paper sx={{ width: '100%', mb: 3 }}>
                            <Tabs
                                value={currentTab}
                                onChange={handleTabChange}
                                aria-label="course management tabs"
                            >
                                <Tab label="Course Info" />
                                <Tab label="Chapters" />
                                <Tab label="Settings" />
                            </Tabs>
                        </Paper>

                        {/* Tab Panels */}
                        <TabPanel value={currentTab} index={0}>
                            <CourseInfo course={selectedCourse} />
                        </TabPanel>

                        <TabPanel value={currentTab} index={1}>
                            <ChaptersTab
                                chapters={selectedCourse.chapters || []}
                                onAddModule={async (chapterId: string, data: ModuleFormData) => {
                                    try {
                                        await courseApi.createModule(selectedCourse.id, chapterId, {
                                            title: data.title,
                                            description: data.description,
                                            type: data.type,
                                            content: data.content,
                                            duration: data.duration,
                                            isRequired: data.isRequired
                                        });
                                        loadCourseDetails(selectedCourse.id);
                                    } catch (error) {
                                        console.error('Failed to create module:', error);
                                    }
                                }}
                                onEditModule={async (moduleId: string, data: ModuleFormData, chapterId: string) => {
                                    try {
                                        await courseApi.updateModule(selectedCourse.id, chapterId, moduleId, {
                                            title: data.title,
                                            description: data.description,
                                            type: data.type,
                                            content: data.content,
                                            duration: data.duration,
                                            isRequired: data.isRequired
                                        });
                                        loadCourseDetails(selectedCourse.id);
                                    } catch (error) {
                                        console.error('Failed to update module:', error);
                                    }
                                }}
                                onDeleteModule={async (moduleId: string, chapterId: string) => {
                                    if (window.confirm('Are you sure you want to delete this module?')) {
                                        try {
                                            await courseApi.deleteModule(selectedCourse.id, chapterId, moduleId);
                                            loadCourseDetails(selectedCourse.id);
                                        } catch (error) {
                                            console.error('Failed to delete module:', error);
                                        }
                                    }
                                }}
                                onAddChapter={async (data: ChapterFormData) => {
                                    try {
                                        await courseApi.createChapter(selectedCourse.id, data);
                                        loadCourseDetails(selectedCourse.id);
                                    } catch (error) {
                                        console.error('Failed to create chapter:', error);
                                    }
                                }}
                                onEditChapter={async (chapter: Chapter) => {
                                    try {
                                        await courseApi.updateChapter(selectedCourse.id, '', chapter.id, {
                                            title: chapter.title,
                                            description: chapter.description,
                                            isOptional: chapter.isOptional,
                                            isFree: chapter.isFree
                                        });
                                        loadCourseDetails(selectedCourse.id);
                                    } catch (error) {
                                        console.error('Failed to update chapter:', error);
                                    }
                                }}
                                onDeleteChapter={async (chapterId: string) => {
                                    if (window.confirm('Are you sure you want to delete this chapter?')) {
                                        try {
                                            await courseApi.deleteChapter(selectedCourse.id, '', chapterId);
                                            loadCourseDetails(selectedCourse.id);
                                        } catch (error) {
                                            console.error('Failed to delete chapter:', error);
                                        }
                                    }
                                }}
                            />
                        </TabPanel>

                        <TabPanel value={currentTab} index={2}>
                            <SettingsTab
                                course={selectedCourse}
                                onPublish={async () => {
                                    try {
                                        await courseApi.publishCourse(selectedCourse.id);
                                        loadCourseDetails(selectedCourse.id);
                                    } catch (error) {
                                        console.error('Failed to publish course:', error);
                                    }
                                }}
                                onUnpublish={async () => {
                                    try {
                                        await courseApi.unpublishCourse(selectedCourse.id);
                                        loadCourseDetails(selectedCourse.id);
                                    } catch (error) {
                                        console.error('Failed to unpublish course:', error);
                                    }
                                }}
                                onArchive={async () => {
                                    // TODO: Implement archive functionality
                                }}
                                onDelete={async () => {
                                    try {
                                        await courseApi.deleteCourse(selectedCourse.id);
                                        navigate('/courses');
                                    } catch (error) {
                                        console.error('Failed to delete course:', error);
                                    }
                                }}
                            />
                        </TabPanel>
                    </>
                )}
            </Box>
        </Layout>
    );
}
