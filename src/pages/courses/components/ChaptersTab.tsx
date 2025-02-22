import React, { useState, useCallback } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography,
    Collapse,
    Chip,
} from '@mui/material';
import {
    Add as AddIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';
import { ModuleType } from '../../../common/enums';
import ChapterForm from './ChapterForm';
import ModuleForm from './ModuleForm';

interface Chapter {
    id: string;
    title: string;
    description?: string;
    position: number;
    isOptional: boolean;
    isFree: boolean;
    modules: Module[];
}

interface Module {
    id: string;
    title: string;
    type: ModuleType;
    description?: string;
    duration?: number;
    position: number;
    isRequired: boolean;
}

interface ChapterFormData {
    title: string;
    description?: string;
    isOptional: boolean;
    isFree: boolean;
}

interface ModuleFormData {
    title: string;
    description?: string;
    type: ModuleType;
    content: any;
    duration?: number;
    isRequired: boolean;
}

interface ChaptersTabProps {
    chapters: Chapter[];
    onAddChapter: (data: ChapterFormData) => void;
    onEditChapter: (chapter: Chapter) => void;
    onDeleteChapter: (chapterId: string) => void;
    onAddModule: (chapterId: string, data: ModuleFormData) => void;
    onEditModule: (moduleId: string, chapterId: string, data: ModuleFormData) => void;
    onDeleteModule: (moduleId: string, chapterId: string) => void;
}

export default function ChaptersTab({
    chapters,
    onAddChapter,
    onEditChapter,
    onDeleteChapter,
    onAddModule,
    onEditModule,
    onDeleteModule,
}: ChaptersTabProps) {
    const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
    const [chapterFormOpen, setChapterFormOpen] = useState(false);
    const [moduleFormOpen, setModuleFormOpen] = useState(false);
    const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
    const [selectedModule, setSelectedModule] = useState<Module | null>(null);
    const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

    const handleToggleChapter = (chapterId: string) => {
        setExpandedChapters(prev =>
            prev.includes(chapterId)
                ? prev.filter(id => id !== chapterId)
                : [...prev, chapterId]
        );
    };

    const getModuleTypeColor = (type: ModuleType) => {
        const colors: Record<ModuleType, string> = {
            VIDEO: '#2196f3',
            TEXT: '#4caf50',
            QUIZ: '#ff9800',
            ASSIGNMENT: '#f44336',
            RESOURCE: '#9c27b0',
            INTERACTIVE: '#3f51b5'
        };
        return colors[type] || '#757575';
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Chapters</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => setChapterFormOpen(true)}
                >
                    Add Chapter
                </Button>
            </Box>

            <List>
                {chapters.map((chapter) => (
                    <Card key={chapter.id} sx={{ mb: 2 }}>
                        <CardContent sx={{ p: 0 }}>
                            <ListItem
                                button
                                onClick={() => handleToggleChapter(chapter.id)}
                                sx={{
                                    borderBottom: expandedChapters.includes(chapter.id)
                                        ? '1px solid rgba(0, 0, 0, 0.12)'
                                        : 'none'
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="subtitle1">
                                                {chapter.title}
                                            </Typography>
                                            {chapter.isOptional && (
                                                <Chip
                                                    label="Optional"
                                                    size="small"
                                                    color="default"
                                                />
                                            )}
                                            {chapter.isFree && (
                                                <Chip
                                                    label="Free"
                                                    size="small"
                                                    color="primary"
                                                />
                                            )}
                                        </Box>
                                    }
                                    secondary={chapter.description}
                                />
                                <Box display="flex" alignItems="center">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedChapter(chapter);
                                            setChapterFormOpen(true);
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteChapter(chapter.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                    {expandedChapters.includes(chapter.id) ? (
                                        <ExpandLessIcon />
                                    ) : (
                                        <ExpandMoreIcon />
                                    )}
                                </Box>
                            </ListItem>

                            <Collapse in={expandedChapters.includes(chapter.id)}>
                                <Box p={2}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="subtitle2">Modules</Typography>
                                        <Button
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={() => {
                                                setSelectedChapterId(chapter.id);
                                                setModuleFormOpen(true);
                                            }}
                                        >
                                            Add Module
                                        </Button>
                                    </Box>

                                    <List>
                                        {chapter.modules.map((module) => (
                                            <ListItem
                                                key={module.id}
                                                sx={{
                                                    bgcolor: 'background.paper',
                                                    borderRadius: 1,
                                                    mb: 1
                                                }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Box display="flex" alignItems="center" gap={1}>
                                                            <Typography>{module.title}</Typography>
                                                            <Chip
                                                                label={module.type}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: getModuleTypeColor(module.type),
                                                                    color: 'white'
                                                                }}
                                                            />
                                                            {!module.isRequired && (
                                                                <Chip
                                                                    label="Optional"
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            )}
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <Box>
                                                            {module.description}
                                                            {module.duration && (
                                                                <Typography variant="caption" display="block">
                                                                    Duration: {module.duration} minutes
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                                <Box>
                                                    <IconButton
                                                        size="small"
                                            onClick={() => {
                                                setSelectedModule(module);
                                                setSelectedChapterId(chapter.id);
                                                setModuleFormOpen(true);
                                            }}
                                                    >
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => onDeleteModule(module.id, chapter.id)}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </ListItem>
                                        ))}
                                        {chapter.modules.length === 0 && (
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                align="center"
                                                py={2}
                                            >
                                                No modules added yet
                                            </Typography>
                                        )}
                                    </List>
                                </Box>
                            </Collapse>
                        </CardContent>
                    </Card>
                ))}
                {chapters.length === 0 && (
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        align="center"
                        py={4}
                    >
                        No chapters added yet. Click the "Add Chapter" button to get started.
                    </Typography>
                )}
            </List>

            {/* Chapter Form Dialog */}
            <ChapterForm
                open={chapterFormOpen}
                onClose={() => {
                    setChapterFormOpen(false);
                    setSelectedChapter(null);
                }}
                onSubmit={(data) => {
                    if (selectedChapter) {
                        onEditChapter({
                            ...selectedChapter,
                            ...data
                        });
                    } else {
                        onAddChapter(data);
                    }
                    setChapterFormOpen(false);
                    setSelectedChapter(null);
                }}
                initialData={selectedChapter || undefined}
                title={selectedChapter ? 'Edit Chapter' : 'Add Chapter'}
            />

            {/* Module Form Dialog */}
            <ModuleForm
                open={moduleFormOpen}
                onClose={() => {
                    setModuleFormOpen(false);
                    setSelectedModule(null);
                    setSelectedChapterId(null);
                }}
                onSubmit={(data) => {
                    if (selectedModule && selectedChapterId) {
                        onEditModule(selectedModule.id, selectedChapterId, data);
                    } else if (selectedChapterId) {
                        onAddModule(selectedChapterId, data);
                    }
                    setModuleFormOpen(false);
                    setSelectedModule(null);
                    setSelectedChapterId(null);
                }}
                initialData={selectedModule ? {
                    title: selectedModule.title,
                    description: selectedModule.description,
                    type: selectedModule.type,
                    content: {}, // Will be populated based on type
                    duration: selectedModule.duration,
                    isRequired: selectedModule.isRequired
                } : undefined}
                title={selectedModule ? 'Edit Module' : 'Add Module'}
            />
        </Box>
    );
}
