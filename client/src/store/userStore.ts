import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  email: string;
};

type UserState = {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user",
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
