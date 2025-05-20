
import React, { createContext, useState, useEffect, useContext } from 'react';

// Define types for our authentication context
type User = {
  id: string;
  username: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  createUser: (username: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
};

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin credentials
const DEFAULT_ADMIN = {
  id: '1',
  username: 'admin',
  password: 'admin123', // In a real app, this would be hashed and not stored in the code
  isAdmin: true
};

// User storage in localStorage
const USER_STORAGE_KEY = 'moveis_oeste_users';
const CURRENT_USER_KEY = 'moveis_oeste_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize users in localStorage if not already present
  useEffect(() => {
    const storedUsers = localStorage.getItem(USER_STORAGE_KEY);
    if (!storedUsers) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify([DEFAULT_ADMIN]));
    }

    // Check if user is already logged in
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (currentUser) {
      const parsedUser = JSON.parse(currentUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const storedUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
    const foundUser = storedUsers.find(
      (u: any) => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const createUser = async (username: string, password: string): Promise<boolean> => {
    if (!user?.isAdmin) return false; // Only admins can create users
    
    const storedUsers = JSON.parse(localStorage.getItem(USER_STORAGE_KEY) || '[]');
    
    // Check if username already exists
    if (storedUsers.some((u: any) => u.username === username)) {
      return false;
    }

    const newUser = {
      id: `${Date.now()}`,
      username,
      password,
      isAdmin: true
    };

    const updatedUsers = [...storedUsers, newUser];
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUsers));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, createUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
