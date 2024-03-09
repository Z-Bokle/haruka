import { create } from 'zustand';

export interface GlobalStore {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;

  baseUrl: string;
  setBaseUrl: (baseUrl: string) => void;
}

export interface ShowDialogConfigs {
  title?: string;
  content: string;
}
export interface DialogStore {
  visible: boolean;
  title?: string;
  content?: string;
  show: (configs: ShowDialogConfigs) => void;
  hide: () => void;
}

const useGlobalStore = create<GlobalStore>(set => ({
  token: null,
  setToken: (token: string | null) => set({ token }),
  clearToken: () => set({ token: null }),

  baseUrl: 'http://10.136.12.203:3000',
  // baseUrl: 'http://192.168.167.15:3000',
  setBaseUrl: (baseUrl: string) => set({ baseUrl }),
}));

const useDialog = create<DialogStore>(set => ({
  visible: false,
  show: (configs: ShowDialogConfigs) => set({ visible: true, ...configs }),
  hide: () => set({ visible: false, title: undefined, content: undefined }),
}));

export { useGlobalStore, useDialog };
