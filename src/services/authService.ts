import { API_BASE_URL } from '../config/constants';
import type { User, LoginResponse } from '../types/user';
import type { RegisterData } from '../types/auth';

class AuthService {
  private baseURL: string = API_BASE_URL;

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log("Base URL: ", url);
    const config: RequestInit = {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    };

    if (options.body) config.body = options.body;

    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`Error: ${response.status}`);

    return response.json() as Promise<T>;
  }

  login(login: string, password: string): Promise<LoginResponse> {
    const loginBody = JSON.stringify({ login, password });
    console.log("Login Body: ", loginBody);

    return this.request<LoginResponse>('/Auth/login', {
      method: 'POST',
      body: loginBody,
    });
  }

  register(data: RegisterData): Promise<LoginResponse> {
    return this.request<LoginResponse>('/Auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  getProfile(token: string): Promise<User> {
    return this.request<User>('/auth/profile', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  logout(token: string): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => ({ success: true }));
  }
}

export const authService = new AuthService();