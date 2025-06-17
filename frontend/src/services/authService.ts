import api from './api';
import { LoginRequest, SignupRequest, JwtResponse, MessageResponse, User } from '../types';

class AuthService {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeToken() {
    this.token = null;
    delete api.defaults.headers.common['Authorization'];
  }

  getToken(): string | null {
    return this.token;
  }

  async login(credentials: LoginRequest): Promise<JwtResponse> {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  }

  async register(userData: SignupRequest): Promise<MessageResponse> {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  }

  logout(): void {
    this.removeToken();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.token || !!localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }
}

export const authService = new AuthService();
