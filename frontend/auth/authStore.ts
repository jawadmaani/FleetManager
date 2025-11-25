import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isInitialized: boolean;

  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
  markInitialized: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      accessToken: null,
      isInitialized: false,

      setUser: (user) => set({ user }),
      setAccessToken: (accessToken) => set({ accessToken }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
        }),

      markInitialized: () => set({ isInitialized: true }),
    }),
    { name: "AuthStore" }
  )
);
