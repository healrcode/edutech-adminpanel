import { ApiClient } from './base';
import type { PaginatedResponse } from './types';

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

export interface EnrollmentStats {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageCompletionRate: number;
}

export class EnrollmentsApi extends ApiClient {
  constructor() {
    super();
  }

  // Get available courses
  async getAvailableCourses(): Promise<PaginatedResponse<Course>> {
    return this.get<PaginatedResponse<Course>>('/enrollments/admin/courses');
  }

  // Get active enrollments for a user
  async getActiveEnrollments(userId: string): Promise<PaginatedResponse<Enrollment>> {
    return this.get<PaginatedResponse<Enrollment>>(`/enrollments/admin/users/${userId}/enrollments`, {
      params: { status: 'ACTIVE' }
    });
  }

  // Get enrollment history for a user
  async getEnrollmentHistory(userId: string): Promise<PaginatedResponse<Enrollment>> {
    return this.get<PaginatedResponse<Enrollment>>(`/enrollments/admin/users/${userId}/enrollments`, {
      params: { status: 'COMPLETED' }
    });
  }

  // Get dropped enrollments for a user
  async getDroppedEnrollments(userId: string): Promise<PaginatedResponse<Enrollment>> {
    return this.get<PaginatedResponse<Enrollment>>(`/enrollments/admin/users/${userId}/enrollments`, {
      params: { status: 'DROPPED' }
    });
  }

  // Get overall enrollment stats
  async getEnrollmentStats(courseId?: string): Promise<EnrollmentStats> {
    return this.get<EnrollmentStats>('/enrollments/admin/enrollments/stats', {
      params: courseId ? { courseId } : undefined
    });
  }

  // Issue certificate for an enrollment
  async issueCertificate(enrollmentId: string): Promise<Enrollment> {
    return this.post<Enrollment>(`/enrollments/admin/enrollments/${enrollmentId}/certificate`);
  }

  // Enroll user in a course
  async enrollUserInCourse(userId: string, courseId: string): Promise<Enrollment> {
    return this.post<Enrollment>(`/enrollments/admin/users/${userId}/enrollments`, {
      courseId
    });
  }
}

export const enrollmentsApi = new EnrollmentsApi();
