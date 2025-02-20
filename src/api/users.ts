import { ApiClient } from './base';
import type { User } from '../store/types';
import type { PaginatedResponse } from './types';

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

interface CreateUserRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  status: string;
}

export class UsersApi extends ApiClient {
  constructor() {
    super();
  }

  // List users with pagination and filters
  async list(params: UserListParams = {}): Promise<PaginatedResponse<User>> {
    return this.get<PaginatedResponse<User>>('/admin/users', { params });
  }

  // Get single user by ID
  async getUser(userId: string): Promise<User> {
    return this.get<User>(`/admin/users/${userId}`);
  }

  // Update user role
  async updateRole(userId: string, role: string): Promise<User> {
    return this.put<User>(`/admin/users/${userId}/role`, { role });
  }

  // Update user status
  async updateStatus(userId: string, status: string): Promise<User> {
    return this.put<User>(`/admin/users/${userId}/status`, { status });
  }

  // Get current user profile
  async me(): Promise<User> {
    return this.get<User>('/users/me');
  }

  // Create new user
  async createUser(data: CreateUserRequest): Promise<User> {
    return this.post<User>('/admin/users', data);
  }

  // Delete user
  async deleteUser(userId: string): Promise<void> {
    return this.delete<void>(`/admin/users/${userId}`);
  }
}

export const usersApi = new UsersApi();
