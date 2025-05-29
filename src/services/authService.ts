
// Mock auth service for frontend-only application
export const authService = {
  async validateSession() {
    // Always return valid for frontend-only app
    return { valid: true };
  },

  async withValidSession<T>(fn: () => Promise<T>): Promise<T> {
    // Just execute the function since there's no real auth
    return await fn();
  },

  async isAuthenticated(): Promise<boolean> {
    // Check if user is "logged in" via localStorage
    return localStorage.getItem('frontend_auth') === 'true';
  },

  async getCurrentUser() {
    // Return mock user if authenticated
    if (await this.isAuthenticated()) {
      return { id: 'mock-user', email: 'admin@example.com' };
    }
    return null;
  }
};
