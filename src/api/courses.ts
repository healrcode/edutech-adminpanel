import { ApiClient } from './base';
import { CourseLevel, Status } from '../common/enums';

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

export class CourseApi extends ApiClient {
    constructor() {
        super();
    }
    // Get all courses (admin)
    async getAllCourses(): Promise<Course[]> {
        return this.get('/courses/admin');
    }

    // Get course by ID
    async getCourse(id: string): Promise<Course> {
        return this.get(`/courses/admin/${id}`);
    }

    // Create new course
    async createCourse(data: CreateCourseInput): Promise<Course> {
        return this.post('/courses/admin', data);
    }

    // Update course
    async updateCourse(id: string, data: UpdateCourseInput): Promise<Course> {
        return this.put(`/courses/admin/${id}`, data);
    }

    // Delete course
    async deleteCourse(id: string): Promise<void> {
        return this.delete(`/courses/admin/${id}`);
    }

    // Publish course
    async publishCourse(id: string): Promise<Course> {
        return this.post(`/courses/admin/${id}/publish`);
    }

    // Unpublish course
    async unpublishCourse(id: string): Promise<Course> {
        return this.post(`/courses/admin/${id}/unpublish`);
    }
}

export const courseApi = new CourseApi();
