import axios from 'axios';
import { Booking, User } from '@/types';
import { PartialBooking } from '@/hooks/useUpdateBooking';

const API_URL = `${import.meta.env.VITE_API_URL}/api`;
const API_URL2 = `${API_URL}/auth`;
export type PartialUser = Partial<User> & { id: string };

// bookingApi.ts
export const createUsers = async (user: Omit<PartialUser, 'id'>) => {
  const res = await axios.post(`${API_URL}/users`, user);
  return res.data;
};
export const getUserById = async (id: string) => {
    const res = await axios.get(`${API_URL}/users/${id}`);
    return res.data;
  };
  export const updateUser = async (user: PartialUser) => {
    const res = await axios.put(`${API_URL}/users/${user.id}`, user);
    return res.data;
  };
  
  export const deleteUser = async (id: string) => {
    const res = await axios.delete(`${API_URL}/users/${id}`);
    return res.data;
  };
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
    message?: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  }
  
  export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      console.log('Attempting login with:', credentials);
      const response = await axios.post(`${API_URL2}/login`, credentials);
      console.log('Login response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
