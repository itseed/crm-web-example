import { create } from 'zustand';

interface AuthState {
  user?: { name: string; bu: string };
  setUser: (user: { name: string; bu: string }) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  logout: () => set({ user: undefined })
}));
