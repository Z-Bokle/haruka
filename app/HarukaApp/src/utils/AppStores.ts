import { create } from 'zustand';

export interface GlobalStore {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

const useGlobalStore = create<GlobalStore>(set => ({
  token: null,
  setToken: (token: string | null) => set({ token }),
  clearToken: () => set({ token: null }),
}));

export { useGlobalStore };
