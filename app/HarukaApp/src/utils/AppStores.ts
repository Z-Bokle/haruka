import { create } from 'zustand';

export interface GlobalStore {
  token: string | null;
}

const useGlobalStore = create<GlobalStore>(set => ({
  token: null,
  setToken: (token: string | null) => set({ token }),
  clearToken: () => set({ token: null }),
}));

export { useGlobalStore };
