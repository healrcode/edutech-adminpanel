import { AxiosResponse } from 'axios';
import client from './client';

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  enrollmentDate: string;
  progress: number;
  certificate: boolean;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'EXPIRED';
  score?: number;
  completedDate?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
}

export interface ListResponse {
  data: Enrollment[];
  total: number;
}

export interface CourseListResponse {
  data: Course[];
  total: number;
}

export const enrollmentsApi = {
  // Get available courses
  getAvailableCourses: (): Promise<AxiosResponse<CourseListResponse>> => {
    return client.get(`/enrollments/admin/courses`);
  },

  // Get active enrollments for a user
  getActiveEnrollments: (userId: string): Promise<AxiosResponse<ListResponse>> => {
    return client.get(`/enrollments/admin/users/${userId}/enrollments`, {
      params: { status: 'ACTIVE' }
    });
  },

  // Get enrollment history for a user
  getEnrollmentHistory: (userId: string): Promise<AxiosResponse<ListResponse>> => {
    return client.get(`/enrollments/admin/users/${userId}/enrollments`, {
      params: { status: 'COMPLETED' }
    });
  },

  // Get dropped enrollments for a user
  getDroppedEnrollments: (userId: string): Promise<AxiosResponse<ListResponse>> => {
    return client.get(`/enrollments/admin/users/${userId}/enrollments`, {
      params: { status: 'DROPPED' }
    });
  },

  // Get enrollment stats for a user
  getEnrollmentStats: (userId: string): Promise<AxiosResponse<{
    totalEnrollments: number;
    completedCourses: number;
    averageProgress: number;
    averageScore: number;
  }>> => {
    return client.get(`/enrollments/admin/enrollments/stats`, {
      params: { userId }
    });
  },

  // Issue certificate for an enrollment
  issueCertificate: (enrollmentId: string): Promise<AxiosResponse<Enrollment>> => {
    return client.post(`/enrollments/admin/enrollments/${enrollmentId}/certificate`);
  },

  // Enroll user in a course
  enrollUserInCourse: (userId: string, courseId: string): Promise<AxiosResponse<Enrollment>> => {
    return client.post(`/enrollments/admin/users/${userId}/enrollments`, {
      courseId
    });
  }
};
