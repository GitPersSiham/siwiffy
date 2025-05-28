
import { useMutation } from '@tanstack/react-query';
import { loginUser, LoginCredentials, LoginResponse } from '@/api/userApi';
import { parseJwt } from '@/utlis/auth';
// Corriger l'import (tu avais `utlis` au lieu de `utils`)

export const useLoginUser = (
  onLoginSuccess?: (data: LoginResponse) => void,
  onLoginError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onSuccess: (data) => {
      const token = data.token;

      if (token) {
        const userInfo = parseJwt(token);
        console.log('User info from token:', userInfo);

        if (userInfo && userInfo.userId) {
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userInfo.userId);
          localStorage.setItem('userEmail', userInfo.email);
          console.log('Stored userId:', userInfo.userId);
        } else {
          console.error('No userId found in token');
        }
      }

      onLoginSuccess?.(data);
    },
    onError: (error) => {
      console.error("Erreur lors de la connexion :", error);
      onLoginError?.(error);
    },
  });
};

