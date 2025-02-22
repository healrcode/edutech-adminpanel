import React, { useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    FormControlLabel,
    Switch,
} from '@mui/material';

interface ChapterFormData {
    title: string;
    description?: string;
    isOptional: boolean;
    isFree: boolean;
}

interface ChapterFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: ChapterFormData) => void;
    initialData?: ChapterFormData;
    title?: string;
}

const defaultData: ChapterFormData = {
    title: '',
    description: '',
    isOptional: false,
    isFree: false,
};

export default function ChapterForm({
    open,
    onClose,
    onSubmit,
    initialData,
    title = 'Add Chapter',
}: ChapterFormProps) {
    const [formData, setFormData] = useState<ChapterFormData>(
        initialData || defaultData
    );

    const handleChange = (field: keyof ChapterFormData, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
                            rows={4}
                            fullWidth
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isOptional}
                                    onChange={(e) => handleChange('isOptional', e.target.checked)}
                                />
                            }
                            label="Optional Chapter"
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={formData.isFree}
                                    onChange={(e) => handleChange('isFree', e.target.checked)}
                                />
                            }
                            label="Free Preview"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {initialData ? 'Update' : 'Create'} Chapter
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
