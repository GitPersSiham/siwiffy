import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  setIsAuthenticated: (auth: boolean) => void;
  setUserId: (id: string | null) => void;
  checkAuthFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set:any) => ({
  isAuthenticated: false,
  userId: null,
  setIsAuthenticated: (auth: boolean) => {
    set({ isAuthenticated: auth });
    localStorage.setItem('isAuthenticated', String(auth));
  },
  setUserId: (id: string | null) => {
    set({ userId: id });
    if (id) {
      localStorage.setItem('userId', id);
    } else {
      localStorage.removeItem('userId');
    }
  },
  checkAuthFromStorage: () => {
    const token = localStorage.getItem('token');
    const authStatus = localStorage.getItem('isAuthenticated');
    const userId = localStorage.getItem('userId');
    set({ 
      isAuthenticated: !!(token && authStatus === 'true'),
      userId: userId
    });
  },
}));
