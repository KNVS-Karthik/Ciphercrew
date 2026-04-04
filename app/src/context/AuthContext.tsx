import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { socketService } from '../services/socket';

interface User {
  _id: string;
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  lastSeen: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  onlineUsers: User[];
  refreshOnlineUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data.user);
          socketService.connect(token);
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Listen for user status updates
  useEffect(() => {
    const handleUserStatus = (data: { userId: string; status: string; user?: User }) => {
      setOnlineUsers((prev) => {
        const exists = prev.find((u) => u._id === data.userId);
        if (data.status === 'offline') {
          return prev.filter((u) => u._id !== data.userId);
        }
        if (exists) {
          return prev.map((u) =>
            u._id === data.userId ? { ...u, status: data.status as any } : u
          );
        }
        if (data.user) {
          return [...prev, { ...data.user, status: data.status as any }];
        }
        return prev;
      });
    };

    socketService.on('user_status', handleUserStatus);
    return () => {
      socketService.off('user_status', handleUserStatus);
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await authAPI.login(username, password);
    const { token, user } = response.data;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);

    // Connect socket
    socketService.connect(token);

    // Fetch online users
    await refreshOnlineUsers();
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }

    socketService.disconnect();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setOnlineUsers([]);
  }, []);

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await authAPI.changePassword(currentPassword, newPassword);
  }, []);

  const refreshOnlineUsers = useCallback(async () => {
    try {
      const response = await authAPI.getOnlineUsers();
      setOnlineUsers(response.data.users);
    } catch (error) {
      console.error('Failed to fetch online users:', error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        changePassword,
        onlineUsers,
        refreshOnlineUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
