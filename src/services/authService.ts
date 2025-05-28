
import { supabase } from "@/integrations/supabase/client";

/**
 * Enhanced authentication service with proper session validation
 */
export const authService = {
  /**
   * Validates the current session and refreshes if needed
   */
  async validateSession() {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session validation error:', sessionError);
        return { valid: false, error: sessionError.message };
      }

      if (!sessionData.session) {
        console.log('No active session found');
        return { valid: false, error: 'No active session' };
      }

      // Check if session is expired or about to expire (within 5 minutes)
      const expiresAt = sessionData.session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      const fiveMinutes = 5 * 60;

      if (expiresAt && expiresAt - now < fiveMinutes) {
        console.log('Session expiring soon, attempting refresh...');
        
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('Session refresh failed:', refreshError);
          return { valid: false, error: 'Session refresh failed' };
        }

        if (!refreshData.session) {
          console.error('No session after refresh');
          return { valid: false, error: 'No session after refresh' };
        }

        console.log('Session refreshed successfully');
        return { valid: true, session: refreshData.session };
      }

      return { valid: true, session: sessionData.session };
    } catch (error: any) {
      console.error('Session validation exception:', error);
      return { valid: false, error: error.message || 'Session validation failed' };
    }
  },

  /**
   * Executes a function with a valid session, refreshing if necessary
   */
  async withValidSession<T>(fn: () => Promise<T>): Promise<T> {
    const validation = await this.validateSession();
    
    if (!validation.valid) {
      throw new Error(validation.error || 'Invalid session. Please log in again.');
    }

    try {
      return await fn();
    } catch (error: any) {
      // Check if error is related to authentication
      if (error.message?.includes('JWT') || 
          error.message?.includes('session') || 
          error.message?.includes('unauthorized') ||
          error.message?.includes('invalid_token')) {
        
        console.log('Auth error detected, attempting session refresh...');
        const refreshValidation = await this.validateSession();
        
        if (!refreshValidation.valid) {
          throw new Error('Session expired. Please log in again.');
        }
        
        // Retry the operation once after refresh
        return await fn();
      }
      
      throw error;
    }
  },

  /**
   * Check if user is currently authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const validation = await this.validateSession();
    return validation.valid;
  },

  /**
   * Get current user safely
   */
  async getCurrentUser() {
    const validation = await this.validateSession();
    if (validation.valid && validation.session) {
      return validation.session.user;
    }
    return null;
  }
};
