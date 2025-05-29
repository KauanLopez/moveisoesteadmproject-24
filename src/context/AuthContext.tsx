
import React, { createContext, useState, useEffect, useContext } from 'react';

type AuthContextType = {
  user: any | null;
  session: any | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  createUser: (email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is "logged in" via localStorage
    const isLoggedIn = localStorage.getItem('frontend_auth') === 'true';
    setIsAuthenticated(isLoggedIn);
    
    if (isLoggedIn) {
      setUser({ id: 'mock-user', email: 'admin@example.com' });
      setSession({ user: { id: 'mock-user', email: 'admin@example.com' } });
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simple check for demo purposes (in real app, you'd validate against stored credentials)
      if (email === 'admin@example.com' && password === 'password') {
        localStorage.setItem('frontend_auth', 'true');
        setIsAuthenticated(true);
        setUser({ id: 'mock-user', email: 'admin@example.com' });
        setSession({ user: { id: 'mock-user', email: 'admin@example.com' } });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a frontend-only app, just store user in localStorage
      const users = JSON.parse(localStorage.getItem('moveis_oeste_users') || '[]');
      const newUser = {
        id: crypto.randomUUID(),
        email,
        password, // In real app, this should be hashed
        isAdmin: true,
        created_at: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('moveis_oeste_users', JSON.stringify(users));
      
      return true;
    } catch (error) {
      console.error('Create user exception:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      localStorage.removeItem('frontend_auth');
      setIsAuthenticated(false);
      setUser(null);
      setSession(null);
      
      // Force page refresh to ensure clean state
      setTimeout(() => {
        window.location.href = '/admin';
      }, 100);
    } catch (error) {
      console.error('Logout exception:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      login, 
      logout,
      createUser,
      isAuthenticated,
      isLoading 
    }}>
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
