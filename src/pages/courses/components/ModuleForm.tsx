import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Switch,
    Typography,
} from '@mui/material';
import { ModuleType } from '../../../common/enums';

interface ModuleFormData {
    title: string;
    description?: string;
    type: ModuleType;
    content: {
        videoUrl?: string;
        text?: string;
        questions?: {
            question: string;
            options: string[];
            correctOption: number;
        }[];
    };
    duration?: number;
    isRequired: boolean;
}

interface ModuleFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ModuleFormData) => void;
    initialData?: ModuleFormData;
    title?: string;
}

const defaultData: ModuleFormData = {
    title: '',
    description: '',
    type: ModuleType.TEXT,
    content: {
        text: ''  // Initialize with empty text for TEXT type
    },
    isRequired: true,
};

export default function ModuleForm({
    open,
    onClose,
    onSubmit,
    initialData,
    title = 'Add Module',
}: ModuleFormProps) {
    const [formData, setFormData] = useState<ModuleFormData>(
        initialData || defaultData
    );
    const [questions, setQuestions] = useState<{
        question: string;
        options: string[];
        correctOption: number;
    }[]>(initialData?.content.questions || []);
    const [errors, setErrors] = useState<{[key: string]: string | undefined}>({});

    const handleChange = (field: keyof ModuleFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error for the field being changed
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    };

    const handleContentChange = (value: any) => {
        setFormData(prev => ({
            ...prev,
            content: {
                ...prev.content,
                ...value
            }
        }));
        // Clear content error
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.content;
            return newErrors;
        });
    };

    const handleAddQuestion = () => {
        setQuestions(prev => [
            ...prev,
            {
                question: '',
                options: ['', '', '', ''],
                correctOption: 0
            }
        ]);
    };

    const handleQuestionChange = (index: number, field: string, value: any) => {
        setQuestions(prev => {
            const newQuestions = [...prev];
            newQuestions[index] = {
                ...newQuestions[index],
                [field]: value
            };
            handleContentChange({ questions: newQuestions });
            return newQuestions;
        });
    };

    const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
        setQuestions(prev => {
            const newQuestions = [...prev];
            newQuestions[questionIndex].options[optionIndex] = value;
            handleContentChange({ questions: newQuestions });
            return newQuestions;
        });
    };

    const validateForm = (): boolean => {
        const newErrors: {[key: string]: string} = {};

        // Title validation
        if (formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters long';
        }

        // Description validation
        if (formData.description && formData.description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters long';
        }

        // Content validation based on type
        switch (formData.type) {
            case ModuleType.TEXT:
                if (!formData.content.text || formData.content.text.length < 10) {
                    newErrors.content = 'Content must be at least 10 characters long';
                }
                break;
            case ModuleType.VIDEO:
                if (!formData.content.videoUrl) {
                    newErrors.content = 'Video URL is required';
                } else {
                    try {
                        new URL(formData.content.videoUrl);
                    } catch {
                        newErrors.content = 'Please enter a valid URL';
                    }
                }
                break;
            case ModuleType.QUIZ:
                if (!formData.content.questions?.length) {
                    newErrors.content = 'At least one question is required';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleTypeChange = (newType: ModuleType) => {
        // Initialize appropriate content structure based on type
        let newContent = {};
        switch (newType) {
            case ModuleType.TEXT:
                newContent = { text: '' };
                break;
            case ModuleType.VIDEO:
                newContent = { videoUrl: '' };
                break;
            case ModuleType.QUIZ:
                newContent = { questions: [] };
                break;
        }

        setFormData(prev => ({
            ...prev,
            type: newType,
            content: newContent
        }));
        setErrors({});  // Clear errors on type change
    };

    const renderContentFields = () => {
        switch (formData.type) {
            case ModuleType.VIDEO:
                return (
                    <>
                        <TextField
                            label="Video URL"
                            value={formData.content.videoUrl || ''}
                            onChange={(e) => handleContentChange({ videoUrl: e.target.value })}
                            required
                            fullWidth
                            error={!!errors.content}
                            helperText={errors.content}
                        />
                        <TextField
                            label="Duration (minutes)"
                            type="number"
                            value={formData.duration || ''}
                            onChange={(e) => handleChange('duration', parseInt(e.target.value) || undefined)}
                            fullWidth
                        />
                    </>
                );

            case ModuleType.TEXT:
                return (
                    <TextField
                        label="Content"
                        value={formData.content.text || ''}
                        onChange={(e) => handleContentChange({ text: e.target.value })}
                        multiline
                        rows={6}
                        required
                        fullWidth
                        error={!!errors.content}
                        helperText={errors.content || 'Minimum 10 characters'}
                    />
                );

            case ModuleType.QUIZ:
                return (
                    <Box>
                        {errors.content && (
                            <Typography color="error" sx={{ mb: 2 }}>
                                {errors.content}
                            </Typography>
                        )}
                        {questions.map((question, qIndex) => (
                            <Box key={qIndex} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                <TextField
                                    label={`Question ${qIndex + 1}`}
                                    value={question.question}
                                    onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                    fullWidth
                                    required
                                    sx={{ mb: 2 }}
                                />
                                {question.options.map((option, oIndex) => (
                                    <Box key={oIndex} display="flex" gap={2} mb={1}>
                                        <TextField
                                            label={`Option ${oIndex + 1}`}
                                            value={option}
                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                            fullWidth
                                            required
                                        />
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={question.correctOption === oIndex}
                                                    onChange={() => handleQuestionChange(qIndex, 'correctOption', oIndex)}
                                                />
                                            }
                                            label="Correct"
                                        />
                                    </Box>
                                ))}
                            </Box>
                        ))}
                        <Button onClick={handleAddQuestion}>Add Question</Button>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <form onSubmit={handleSubmit}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={3} py={2}>
                        <TextField
                            label="Title"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            required
                            fullWidth
                            error={!!errors.title}
                            helperText={errors.title || 'Minimum 3 characters'}
                        />

                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            multiline
                            rows={2}
                            fullWidth
                            error={!!errors.description}
                            helperText={errors.description || 'Minimum 10 characters'}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Module Type</InputLabel>
                            <Select
                                value={formData.type}
                                label="Module Type"
                                onChange={(e) => handleTypeChange(e.target.value as ModuleType)}
                                required
                            >
                                {Object.values(ModuleType).map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isRequired}
                                    onChange={(e) => handleChange('isRequired', e.target.checked)}
                                />
                            }
                            label="Required Module"
                        />

                        {renderContentFields()}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {initialData ? 'Update' : 'Create'} Module
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
