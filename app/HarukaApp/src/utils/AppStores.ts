import { create } from 'zustand';

export interface GlobalStore {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;

  baseUrl: string;
  setBaseUrl: (baseUrl: string) => void;
}

const useGlobalStore = create<GlobalStore>(set => ({
  token: null,
  setToken: (token: string | null) => set({ token }),
  clearToken: () => set({ token: null }),

  baseUrl: '127.0.0.1',
  setBaseUrl: (baseUrl: string) => set({ baseUrl }),
}));

export { useGlobalStore };
