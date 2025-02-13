import { ApiClient } from '../base';
import type { User } from '../../store/types';

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

interface AdminDashboardStats {
  totalCourses: number;
  totalChapters: number;
  totalStudents: number;
  activeCourses: number;
  draftCourses: number;
}

class AdminClient extends ApiClient {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<AdminDashboardStats> {
    return this.get<AdminDashboardStats>('/admin/dashboard/stats');
  }

  /**
   * List instructors with pagination
   */
  async listInstructors(page = 1, pageSize = 10): Promise<PaginatedResponse<User>> {
    return this.get<PaginatedResponse<User>>(`/admin/instructors?page=${page}&pageSize=${pageSize}`);
  }

  /**
   * Add instructor
   */
  async addInstructor(data: { email: string; firstName?: string; lastName?: string }) {
    return this.post<User>('/admin/instructors', data);
  }

  /**
   * Update instructor status
   */
  async updateInstructorStatus(instructorId: string, status: string) {
    return this.put<User>(`/admin/instructors/${instructorId}/status`, { status });
  }

  /**
   * Delete instructor
   */
  async deleteInstructor(instructorId: string) {
    return this.delete(`/admin/instructors/${instructorId}`);
  }

  // Course management endpoints
  async approveCourse(courseId: string) {
    return this.put(`/admin/courses/${courseId}/approve`);
  }

  async rejectCourse(courseId: string, reason: string) {
    return this.put(`/admin/courses/${courseId}/reject`, { reason });
  }

  async suspendCourse(courseId: string, reason: string) {
    return this.put(`/admin/courses/${courseId}/suspend`, { reason });
  }

  // User management endpoints
  async listUsers(page = 1, pageSize = 10): Promise<PaginatedResponse<User>> {
    return this.get<PaginatedResponse<User>>(`/admin/users?page=${page}&pageSize=${pageSize}`);
  }

  async updateUserStatus(userId: string, status: string) {
    return this.put<User>(`/admin/users/${userId}/status`, { status });
  }

  async updateUserRole(userId: string, role: string) {
    return this.put<User>(`/admin/users/${userId}/role`, { role });
  }
}

export const adminClient = new AdminClient();
