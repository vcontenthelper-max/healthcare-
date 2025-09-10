import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor' | 'guardian';
  dateOfBirth?: string;
  phone?: string;
  emergencyContact?: string;
  createdAt: Date;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('healthTracker_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('healthTracker_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate authentication - In production, this would be a real API call
    const users = JSON.parse(localStorage.getItem('healthTracker_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('healthTracker_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    dateOfBirth?: string;
    phone?: string;
    role?: 'patient' | 'doctor' | 'guardian';
  }): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('healthTracker_users') || '[]');
      
      // Check if user already exists
      if (users.find((u: any) => u.email === userData.email)) {
        return false;
      }

      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role || 'patient',
        dateOfBirth: userData.dateOfBirth,
        phone: userData.phone,
        createdAt: new Date(),
      };

      const userWithPassword = { ...newUser, password: userData.password };
      users.push(userWithPassword);
      localStorage.setItem('healthTracker_users', JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem('healthTracker_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('healthTracker_user');
  };

  return { user, login, register, logout };
}