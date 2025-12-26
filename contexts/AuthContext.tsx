import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Basit authentication - gerçek uygulamada API çağrısı yapılmalı
      const users = await AsyncStorage.getItem('users');
      const usersList = users ? JSON.parse(users) : [];
      
      const foundUser = usersList.find(
        (u: any) => u.email === email && u.password === password
      );

      if (foundUser) {
        const userData = { email: foundUser.email, name: foundUser.name };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        // Kullanıcı durumunu online olarak işaretle
        const updatedUsersList = usersList.map((u: any) => 
          u.email === email ? { ...u, status: 'online' } : u
        );
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsersList));
        
        router.replace('/chatlist');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name?: string): Promise<boolean> => {
    try {
      const users = await AsyncStorage.getItem('users');
      const usersList = users ? JSON.parse(users) : [];
      
      // Email kontrolü
      const exists = usersList.find((u: any) => u.email === email);
      if (exists) {
        return false; // Email zaten kayıtlı
      }

      const newUser = { email, password, name: name || email.split('@')[0], status: 'online' };
      usersList.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(usersList));

      const userData = { email, name: newUser.name };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      router.replace('/chatlist');
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Kullanıcı durumunu offline olarak işaretle
      const currentUser = await AsyncStorage.getItem('user');
      if (currentUser) {
        const userData = JSON.parse(currentUser);
        const users = await AsyncStorage.getItem('users');
        const usersList = users ? JSON.parse(users) : [];
        
        // Kullanıcı listesinde durumu offline yap
        const updatedUsersList = usersList.map((u: any) => 
          u.email === userData.email ? { ...u, status: 'offline' } : u
        );
        await AsyncStorage.setItem('users', JSON.stringify(updatedUsersList));
      }
      
      // Giriş yapmış kullanıcı bilgisini sil
      await AsyncStorage.removeItem('user');
      setUser(null);
      
      // Login ekranına yönlendir
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

