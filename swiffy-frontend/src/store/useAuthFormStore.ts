import { create } from 'zustand';

interface AuthFormState {
  id:string,
  name:string;
  email: string;
  password: string;
  setField: (name: keyof AuthFormState, value: string) => void;
  resetForm: () => void;
}

export const useAuthFormStore = create<AuthFormState>((set) => ({
  id:'',
  name:'',
  email:'',
  password: '',
  setField: (name, value) => set((state) => ({ ...state, [name]: value })),
  resetForm: () => set({ name: '', email: '', password: '' }),
}));
