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
  status: 'active' | 'completed' | 'dropped';
  score?: number;
  completedDate?: string;
}

export interface ListResponse {
  data: Enrollment[];
  total: number;
}

export const enrollmentsApi = {
  // Get active enrollments for a user
  getActiveEnrollments: (userId: string): Promise<AxiosResponse<ListResponse>> => {
    return client.get(`/enrollments/admin/enrollments`, {
      params: { userId, status: 'active' }
    });
  },

  // Get enrollment history for a user
  getEnrollmentHistory: (userId: string): Promise<AxiosResponse<ListResponse>> => {
    return client.get(`/enrollments/admin/enrollments`, {
      params: { userId, status: ['completed', 'dropped'] }
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
  }
};
