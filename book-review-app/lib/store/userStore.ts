import { create } from "zustand";
import { User } from "../types";
import { getUsers, getUserById } from "../utils/localStorage";

interface UserState {
  users: User[];
  activeUser: User | null;
  setUsers: (users: User[]) => void;
  setActiveUser: (userId: string) => void;
  addUser: (user: User) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  activeUser: null,
  setUsers: (users) => set({ users }),
  setActiveUser: (userId) =>
    set((state) => {
      const user = getUserById(userId);
      return { activeUser: user || null };
    }),
  addUser: (user) =>
    set((state) => ({
      users: [...state.users, user],
      activeUser: user,
    })),
}));

// Initialize the store
export const initializeUserStore = () => {
  const users = getUsers();
  useUserStore.getState().setUsers(users);
};
