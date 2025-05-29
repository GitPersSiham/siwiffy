// stores/useAuthStore.ts
/*import { create } from 'zustand';
import { User } from "@/types/User"


type AuthState = {
  isAuthenticated: boolean,
  user: User | null;
  login: (credentials: User) => void; // Définition de la fonction login
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (credentials: any) => {
    set({ isAuthenticated: true, user: {  email: credentials.email, id: credentials.userId , name:credentials.name } });
   
  },
  register: (userData : any) => {
    console.log('Inscription avec :', userData);
    set({ isAuthenticated: true, user: { email: userData.email, id: userData.userId , name:userData.name } });
  },
  logout: () => set({ isAuthenticated: false, user: null }),
}));
*/
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  setIsAuthenticated: (auth: boolean) => void;
  setUserId: (id: string | null) => void;
  checkAuthFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
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
