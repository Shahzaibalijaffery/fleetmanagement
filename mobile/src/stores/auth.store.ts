import { create } from 'zustand';

import type { PublicUser } from '@/features/auth/types/auth.types';
import { hasStoredSession } from '@/features/auth/services/token.storage';

interface AuthState {
  user: PublicUser | null;
  isAuthenticated: boolean;
  isBootstrapped: boolean;
  setSession: (user: PublicUser | null) => void;
  setBootstrapped: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: hasStoredSession(),
  isBootstrapped: false,
  setSession: (user) =>
    set({
      user,
      isAuthenticated: Boolean(user),
    }),
  setBootstrapped: (value) => set({ isBootstrapped: value }),
}));
