
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { authService, profileService } from '@/services/supabaseService';
import { Profile } from '@/types/customTypes';

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  createUser: (email: string, password: string) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile loading to prevent deadlocks
          setTimeout(async () => {
            try {
              const userProfile = await profileService.getProfile(session.user.id);
              setProfile(userProfile);
            } catch (error) {
              console.error('Error loading user profile:', error);
              setProfile(null);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    authService.getSession().then((session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authService.signIn(email, password);
      return !result.error;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      // Force page refresh for clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const createUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authService.signUp(email, password);
      return !result.error;
    } catch (error) {
      console.error('Create user error:', error);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authService.signIn(email, password);
      if (result.error) {
        return { error: result.error };
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const result = await authService.signUp(email, password, fullName);
      if (result.error) {
        return { error: result.error };
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      // Force page refresh for clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      login,
      logout,
      createUser,
      isAuthenticated,
      isAdmin,
      signIn,
      signUp,
      signOut
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
