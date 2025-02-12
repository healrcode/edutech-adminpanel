import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStore, User } from './types';

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      isAuthenticated: false,
      otpFlow: {
        email: '',
        showOtp: false,
      },

      setUser: (user: User | null) =>
        set((state) => ({
          user,
          isAuthenticated: !!user,
        })),

      setLoading: (loading: boolean) =>
        set(() => ({
          loading,
        })),

      setOtpFlowState: (email: string, showOtp: boolean) =>
        set((state) => ({
          otpFlow: {
            email,
            showOtp,
          },
        })),

      clearOtpFlow: () =>
        set((state) => ({
          otpFlow: {
            email: '',
            showOtp: false,
          },
        })),

      logout: () =>
        set((state) => ({
          user: null,
          isAuthenticated: false,
          otpFlow: {
            email: '',
            showOtp: false,
          },
        })),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        otpFlow: state.otpFlow,
        // Don't persist sensitive data
        user: null,
        isAuthenticated: false,
        loading: false,
      }),
    }
  )
);

export default useAuthStore;
