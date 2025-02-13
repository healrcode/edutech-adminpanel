import { useState, useCallback } from 'react';
import { adminClient } from '../api/admin/client';
import { User } from '../store/types';

interface UseAdminReturn {
  // Dashboard
  stats: {
    totalCourses: number;
    totalChapters: number;
    totalStudents: number;
    activeCourses: number;
    draftCourses: number;
  } | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchDashboardStats: () => Promise<void>;
  
  // Instructor Management
  instructors: User[];
  totalInstructors: number;
  fetchInstructors: (page?: number, pageSize?: number) => Promise<void>;
  addInstructor: (data: { email: string; firstName?: string; lastName?: string }) => Promise<void>;
  updateInstructorStatus: (instructorId: string, status: string) => Promise<void>;
  deleteInstructor: (instructorId: string) => Promise<void>;
  
  // Course Management
  approveCourse: (courseId: string) => Promise<void>;
  rejectCourse: (courseId: string, reason: string) => Promise<void>;
  suspendCourse: (courseId: string, reason: string) => Promise<void>;
  
  // User Management
  users: User[];
  totalUsers: number;
  currentPage: number;
  fetchUsers: (page?: number, pageSize?: number) => Promise<void>;
  updateUserStatus: (userId: string, status: string) => Promise<void>;
  updateUserRole: (userId: string, role: string) => Promise<void>;
}

export function useAdmin(): UseAdminReturn {
  const [stats, setStats] = useState<UseAdminReturn['stats']>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [totalInstructors, setTotalInstructors] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDashboardStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await adminClient.getDashboardStats();
      setStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchInstructors = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminClient.listInstructors(page, pageSize);
      setInstructors(response.data);
      setTotalInstructors(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch instructors');
    } finally {
      setLoading(false);
    }
  }, []);

  const addInstructor = useCallback(async (data: { email: string; firstName?: string; lastName?: string }) => {
    setLoading(true);
    setError(null);
    try {
      await adminClient.addInstructor(data);
      await fetchInstructors(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add instructor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInstructors]);

  const updateInstructorStatus = useCallback(async (instructorId: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminClient.updateInstructorStatus(instructorId, status);
      await fetchInstructors(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update instructor status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInstructors]);

  const deleteInstructor = useCallback(async (instructorId: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminClient.deleteInstructor(instructorId);
      await fetchInstructors(); // Refresh list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete instructor');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchInstructors]);

  const approveCourse = useCallback(async (courseId: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminClient.approveCourse(courseId);
      await fetchDashboardStats(); // Refresh stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardStats]);

  const rejectCourse = useCallback(async (courseId: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminClient.rejectCourse(courseId, reason);
      await fetchDashboardStats(); // Refresh stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardStats]);

  const suspendCourse = useCallback(async (courseId: string, reason: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminClient.suspendCourse(courseId, reason);
      await fetchDashboardStats(); // Refresh stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to suspend course');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchDashboardStats]);

  const fetchUsers = useCallback(async (page = 1, pageSize = 10) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminClient.listUsers(page, pageSize);
      setUsers(response.data);
      setTotalUsers(response.total);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserStatus = useCallback(async (userId: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminClient.updateUserStatus(userId, status);
      await fetchUsers(currentPage); // Refresh current page
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user status');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, currentPage]);

  const updateUserRole = useCallback(async (userId: string, role: string) => {
    setLoading(true);
    setError(null);
    try {
      await adminClient.updateUserRole(userId, role);
      await fetchUsers(currentPage); // Refresh current page
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, currentPage]);

  return {
    stats,
    loading,
    error,
    fetchDashboardStats,
    instructors,
    totalInstructors,
    fetchInstructors,
    addInstructor,
    updateInstructorStatus,
    deleteInstructor,
    approveCourse,
    rejectCourse,
    suspendCourse,
    users,
    totalUsers,
    currentPage,
    fetchUsers,
    updateUserStatus,
    updateUserRole,
  };
}
