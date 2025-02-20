import api from './client';
import { CourseLevel, Status } from '../common/enums';
import { ApiResponse } from './types';

export interface Course {
    id: string;
    title: string;
    description: string;
    objectives: string[];
    requirements: string[];
    thumbnail?: string;
    duration?: number;
    level: CourseLevel;
    status: Status;
    teacherId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCourseInput {
    title: string;
    description: string;
    objectives: string[];
    requirements: string[];
    level: CourseLevel;
    duration?: number;
    thumbnail?: string;
}

export interface UpdateCourseInput extends Partial<CreateCourseInput> {
    status?: Status;
}

export const courseApi = {
    // Get all courses (admin)
    getAllCourses: async (): Promise<Course[]> => {
        const response = await api.get<ApiResponse<Course[]>>('/courses/admin');
        return response.data.data;
    },

    // Get course by ID
    getCourse: async (id: string): Promise<Course> => {
        const response = await api.get<ApiResponse<Course>>(`/courses/admin/${id}`);
        return response.data.data;
    },

    // Create new course
    createCourse: async (data: CreateCourseInput): Promise<Course> => {
        const response = await api.post<ApiResponse<Course>>('/courses/admin', data);
        return response.data.data;
    },

    // Update course
    updateCourse: async (id: string, data: UpdateCourseInput): Promise<Course> => {
        const response = await api.put<ApiResponse<Course>>(`/courses/admin/${id}`, data);
        return response.data.data;
    },

    // Delete course
    deleteCourse: async (id: string): Promise<void> => {
        await api.delete(`/courses/admin/${id}`);
    },

    // Publish course
    publishCourse: async (id: string): Promise<Course> => {
        const response = await api.post<ApiResponse<Course>>(`/courses/admin/${id}/publish`);
        return response.data.data;
    },

    // Unpublish course
    unpublishCourse: async (id: string): Promise<Course> => {
        const response = await api.post<ApiResponse<Course>>(`/courses/admin/${id}/unpublish`);
        return response.data.data;
    }
};
