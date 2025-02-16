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
  list: async (params: UserListParams = {}): Promise<PaginatedResponse<User>> => {
    return api.get('/admin/users', { params });
  },

  // Get single user by ID
  get: async (userId: string): Promise<User> => {
    return api.get(`/admin/users/${userId}`);
  },

  // Update user role
  updateRole: async (userId: string, role: string): Promise<User> => {
    return api.put(`/admin/users/${userId}/role`, { role });
  },

  // Update user status
  updateStatus: async (userId: string, status: string): Promise<User> => {
    return api.put(`/admin/users/${userId}/status`, { status });
  },

  // Get current user profile
  me: async (): Promise<User> => {
    return api.get('/users/me');
  }
};
