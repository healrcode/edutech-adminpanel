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
    content: {},
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

    const handleChange = (field: keyof ModuleFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleContentChange = (value: any) => {
        setFormData(prev => ({
            ...prev,
            content: {
                ...prev.content,
                ...value
            }
        }));
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
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
                    />
                );

            case ModuleType.QUIZ:
                return (
                    <Box>
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
                        />

                        <TextField
                            label="Description"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            multiline
                            rows={2}
                            fullWidth
                        />

                        <FormControl fullWidth>
                            <InputLabel>Module Type</InputLabel>
                            <Select
                                value={formData.type}
                                label="Module Type"
                                onChange={(e) => handleChange('type', e.target.value)}
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
