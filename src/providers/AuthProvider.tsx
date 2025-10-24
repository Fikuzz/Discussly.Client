import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { authService } from '../services/authService';
import { signalRService } from '../services/signalRService';
import { AuthContext } from '../context/AuthContext';
import useSignalR from '../hooks/useSignalR';
import type { AuthContextType, LoginResult } from '../types/auth';
import type { User } from '../types/user';

// Пропсы для провайдера
interface AuthProviderProps {
  children: ReactNode;
}

// Компонент-провайдер (теперь это React компонент)
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useSignalR({
    AvatarChanged: (newAvatarName: string) => {
      console.log('🔄 SignalR: Avatar changed to', newAvatarName);
      setUser((prevUser: User | null) => prevUser ? { ...prevUser, avatarFileName: newAvatarName } : null);
      updateLocalStorageUser({ avatarFileName: newAvatarName });
    },
    UsernameChanged: (newUsername: string) => {
      console.log('🔄 SignalR: Username changed to', newUsername);
      setUser((prevUser: User | null) => prevUser ? { ...prevUser, username: newUsername } : null);
      updateLocalStorageUser({ username: newUsername });
    },
  });

  const checkAuth = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        const userData: User = JSON.parse(savedUser);
        setUser(userData);

        if (!signalRService.isConnected()) {
          await signalRService.startConnection(token);
        }
      } catch (error) {
        console.error('❌ Error parsing saved user:', error);
        await logout();
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const updateLocalStorageUser = (updates: Partial<User>) => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      const updatedUser = { ...userData, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const login = async (email: string, password: string): Promise<LoginResult> => {
    try {
      setError(null);
      console.log('🔐 Attempting login for:', email);

      const data = await authService.login(email, password);

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      console.log('🔄 Connecting SignalR after login...');
      await signalRService.startConnection(data.token);

      return { success: true, user: data.user };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка входа';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (username: string, email: string, password: string): Promise<LoginResult> => {
    try {
      setError(null);
      console.log('👤 Attempting registration for:', username, email);

      const result = await authService.register({ username, email, password });

      localStorage.setItem('authToken', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      setUser(result.user);

      console.log('🔄 Connecting SignalR after registration...');
      await signalRService.startConnection(result.token);

      return { success: true, user: result.user };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка регистрации';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async (): Promise<void> => {
    console.log('🚪 Logging out...');

    await signalRService.stopConnection();

    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    setUser(null);
    setError(null);

    console.log('✅ Logout completed');
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};