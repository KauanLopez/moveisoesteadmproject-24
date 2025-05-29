
// This file is no longer needed since we removed the Supabase backend
// All data operations now use localStorage through localStorageService

export const dbOperations = {
  content: {
    async selectAll() {
      return { data: null, error: new Error('Database operations not available in frontend-only mode') };
    },
    
    async selectBySection(section: string) {
      return { data: null, error: new Error('Database operations not available in frontend-only mode') };
    },
    
    async upsert(item: any) {
      return { data: null, error: new Error('Database operations not available in frontend-only mode') };
    },
    
    async delete(id: string) {
      return { error: new Error('Database operations not available in frontend-only mode') };
    }
  }
};
