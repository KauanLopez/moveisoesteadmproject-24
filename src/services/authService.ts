
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

export class AuthService {
  private static instance: AuthService;
  private refreshPromise: Promise<Session | null> | null = null;

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Verifica se há uma sessão válida e a renova se necessário
   */
  async ensureValidSession(): Promise<Session | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao obter sessão:', error);
        return null;
      }

      if (!session) {
        console.log('Nenhuma sessão encontrada');
        return null;
      }

      // Verificar se o token expira em menos de 5 minutos
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at || 0;
      const timeUntilExpiry = expiresAt - now;

      console.log(`Token expira em ${timeUntilExpiry} segundos`);

      // Se expira em menos de 5 minutos (300 segundos), renovar
      if (timeUntilExpiry < 300) {
        console.log('Token próximo do vencimento, renovando...');
        return await this.refreshSession();
      }

      return session;
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      return null;
    }
  }

  /**
   * Renova a sessão de forma thread-safe
   */
  async refreshSession(): Promise<Session | null> {
    // Evitar múltiplas renovações simultâneas
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this._doRefreshSession();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    
    return result;
  }

  private async _doRefreshSession(): Promise<Session | null> {
    try {
      console.log('Renovando token de autenticação...');
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Erro ao renovar sessão:', error);
        return null;
      }

      if (data.session) {
        console.log('Token renovado com sucesso');
        return data.session;
      }

      return null;
    } catch (error) {
      console.error('Exceção ao renovar sessão:', error);
      return null;
    }
  }

  /**
   * Executa uma operação com verificação automática de sessão
   */
  async withValidSession<T>(operation: () => Promise<T>): Promise<T> {
    const session = await this.ensureValidSession();
    
    if (!session) {
      throw new Error('Sessão expirada. Por favor, faça login novamente.');
    }

    try {
      return await operation();
    } catch (error: any) {
      // Se o erro for relacionado à autenticação, tentar renovar uma vez
      if (this.isAuthError(error)) {
        console.log('Erro de autenticação detectado, tentando renovar sessão...');
        const refreshedSession = await this.refreshSession();
        
        if (!refreshedSession) {
          throw new Error('Sessão expirada. Por favor, faça login novamente.');
        }

        // Tentar a operação novamente com a sessão renovada
        return await operation();
      }
      
      throw error;
    }
  }

  private isAuthError(error: any): boolean {
    if (!error) return false;
    
    const message = error.message?.toLowerCase() || '';
    const code = error.code || '';
    
    return (
      message.includes('jwt') ||
      message.includes('token') ||
      message.includes('unauthorized') ||
      message.includes('authentication') ||
      code === '401' ||
      code === 'PGRST301'
    );
  }
}

export const authService = AuthService.getInstance();
