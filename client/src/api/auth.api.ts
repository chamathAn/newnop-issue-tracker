import api from './axios';
import type { AuthUser } from '@/types';

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  getMe: () => api.get<AuthUser>('/auth/me').then((r) => r.data),
};
