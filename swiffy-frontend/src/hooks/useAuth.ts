import { useMutation } from '@tanstack/react-query';
import { loginUser, LoginCredentials, LoginResponse } from '@/api/userApi';
import { parseJwt } from '@/utlis/auth';


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

        if (userInfo && userInfo.id) {
          localStorage.setItem('token', token);
          localStorage.setItem('userId', userInfo.id);
          localStorage.setItem('userEmail', userInfo.email);
          console.log('Stored userId:', userInfo.id);
        } else {
          console.error('No user id found in token');
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

