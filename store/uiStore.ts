import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: number;
}

interface UIStore {
  modals: Record<string, boolean>;
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Notification[];
  
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      modals: {},
      theme: 'light',
      sidebarOpen: false,
      notifications: [],
      
      openModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: true },
        })),
      
      closeModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: false },
        })),
      
      toggleModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: !state.modals[modalId] },
        })),
      
      setTheme: (theme) =>
        set({ theme }),
      
      setSidebarOpen: (open) =>
        set({ sidebarOpen: open }),
      
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            ...state.notifications,
            {
              ...notification,
              id: Math.random().toString(36).substring(7),
              timestamp: Date.now(),
            },
          ],
        })),
      
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
      
      clearNotifications: () =>
        set({ notifications: [] }),
    }),
    {
      name: 'rvm-ui-storage',
    }
  )
);

