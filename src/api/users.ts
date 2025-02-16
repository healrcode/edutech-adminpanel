import api from './client';
import type { User } from '../store/types';
import type { ApiResponse, PaginatedResponse } from './types';

interface UserListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
  status?: string;
}

interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  role?: string;
  status?: string;
}

export const usersApi = {
  // List users with pagination and filters
  list: (params: UserListParams = {}): Promise<PaginatedResponse<User>> =>
    api.get('/admin/users', { params }),

  // Get single user by ID
  get: (userId: string): Promise<User> =>
    api.get(`/admin/users/${userId}`),

  // Update user
  update: (userId: string, data: UserUpdateRequest): Promise<User> =>
    api.put(`/admin/users/${userId}`, data),

  // Update user status
  updateStatus: (userId: string, status: string): Promise<User> =>
    api.put(`/admin/users/${userId}/status`, { status }),

  // Update user role
  updateRole: (userId: string, role: string): Promise<User> =>
    api.put(`/admin/users/${userId}/role`, { role })
};
