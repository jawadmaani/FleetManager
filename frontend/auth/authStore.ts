"use client";

import { create } from "zustand";

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;

  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,

  setUser: (user) => set({ user }),
  setAccessToken: (accessToken) => set({ accessToken }),

  clearAuth: () => set({
    user: null,
    accessToken: null,
  }),
}));
