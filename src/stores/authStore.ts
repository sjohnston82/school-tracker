import { create } from "zustand";

export type User =
  | {
      id?: string;
      username?: string;
      email?: string | null;
      emailVerfied?: Date;
      image?: string | null;
      sub?: string;
      displayName?: string;
      date?: Date;
      autoArchive?: boolean;
      name?: string | null;
    }
  | undefined;

interface IAuthStore {
  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  user: User | null;
  setUser: (user: User) => void;
}

export const useAuthStore = create<IAuthStore>((set) => ({
  authenticated: false,
  user: null,
  setAuthenticated: (val) => set({ authenticated: val }),
  setUser: (user) => set({ user }),
}));
