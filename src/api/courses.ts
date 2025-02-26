import { ApiClient } from './base';
import { CourseLevel, Status, ModuleType } from '../common/enums';

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
    chapters: {
        id: string;
        title: string;
        description?: string;
        position: number;
        isOptional: boolean;
        isFree: boolean;
            modules: {
                id: string;
                title: string;
                type: ModuleType;
                description?: string;
                duration?: number;
                position: number;
                isRequired: boolean;
                content: {
                    videoUrl?: string;
                    text?: string;
                    questions?: {
                        question: string;
                        options: string[];
                        correctOption: number;
                        explanation?: string;
                    }[];
                };
            }[];
    }[];
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

export class CoursesApi extends ApiClient {
    constructor() {
        super();
    }

    // Course management
    async getAllCourses(): Promise<Course[]> {
        return this.get<Course[]>('/courses/admin');
    }

    async getCourse(id: string): Promise<Course> {
        return this.get<Course>(`/courses/admin/${id}`);
    }

    async createCourse(data: CreateCourseInput): Promise<Course> {
        return this.post<Course>('/courses/admin', data);
    }

    async updateCourse(id: string, data: UpdateCourseInput): Promise<Course> {
        return this.put<Course>(`/courses/admin/${id}`, data);
    }

    async deleteCourse(id: string): Promise<void> {
        return this.delete<void>(`/courses/admin/${id}`);
    }

    async publishCourse(id: string): Promise<Course> {
        return this.post<Course>(`/courses/admin/${id}/publish`);
    }

    async unpublishCourse(id: string): Promise<Course> {
        return this.post<Course>(`/courses/admin/${id}/unpublish`);
    }

    // Module management
    async getModulesByChapter(courseId: string, chapterId: string): Promise<Course> {
        return this.get<Course>(`/courses/admin/${courseId}/chapters/${chapterId}/modules`);
    }

    async createModule(courseId: string, chapterId: string, data: {
        title: string;
        description?: string;
        type: ModuleType;
        content: any;
        duration?: number;
        isRequired: boolean;
    }): Promise<Course> {
        return this.post<Course>(`/courses/admin/${courseId}/chapters/${chapterId}/modules`, data);
    }

    async updateModule(courseId: string, chapterId: string, moduleId: string, data: {
        title?: string;
        description?: string;
        type?: ModuleType;
        content?: any;
        duration?: number;
        isRequired?: boolean;
    }): Promise<Course> {
        return this.put<Course>(`/courses/admin/${courseId}/chapters/${chapterId}/modules/${moduleId}`, data);
    }

    async deleteModule(courseId: string, chapterId: string, moduleId: string): Promise<void> {
        return this.delete<void>(`/courses/admin/${courseId}/chapters/${chapterId}/modules/${moduleId}`);
    }

    async reorderModules(courseId: string, chapterId: string, moduleIds: string[]): Promise<Course> {
        return this.put<Course>(`/courses/admin/${courseId}/chapters/${chapterId}/modules/order`, { moduleIds });
    }

    // Chapter management
    async getChapters(courseId: string): Promise<Course> {
        return this.get<Course>(`/courses/admin/${courseId}/chapters`);
    }

    async createChapter(courseId: string, data: {
        title: string;
        description?: string;
        isOptional: boolean;
        isFree: boolean;
    }): Promise<Course> {
        return this.post<Course>(`/courses/admin/${courseId}/chapters`, data);
    }

    // Legacy chapter-module methods
    async getChaptersByModule(courseId: string, moduleId: string): Promise<Course> {
        return this.get<Course>(`/courses/admin/${courseId}/modules/${moduleId}/chapters`);
    }

    async createChapterInModule(courseId: string, moduleId: string, data: {
        title: string;
        description?: string;
        isOptional: boolean;
        isFree: boolean;
    }): Promise<Course> {
        return this.post<Course>(`/courses/admin/${courseId}/modules/${moduleId}/chapters`, data);
    }

    async updateChapter(courseId: string, moduleId: string, chapterId: string, data: {
        title?: string;
        description?: string;
        isOptional?: boolean;
        isFree?: boolean;
    }): Promise<Course> {
        return this.put<Course>(`/courses/admin/${courseId}/modules/${moduleId}/chapters/${chapterId}`, data);
    }

    async deleteChapter(courseId: string, moduleId: string, chapterId: string): Promise<void> {
        return this.delete<void>(`/courses/admin/${courseId}/modules/${moduleId}/chapters/${chapterId}`);
    }

    async reorderChapters(courseId: string, moduleId: string, chapterIds: string[]): Promise<Course> {
        return this.put<Course>(`/courses/admin/${courseId}/modules/${moduleId}/chapters/order`, { chapterIds });
    }
}

export const courseApi = new CoursesApi();
