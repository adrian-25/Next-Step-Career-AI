import { supabase } from '@/integrations/supabase/client';
import { AuditLogService } from './auditLog.service';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
  last_sign_in_at?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  job_title?: string;
  company?: string;
  experience_level: 'entry' | 'mid' | 'senior' | 'executive';
  target_roles: string[];
  skills: string[];
  bio?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User | null;
  session: any;
  error: string | null;
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthService {
  /**
   * Sign up a new user
   */
  static async signUp(data: SignUpData): Promise<AuthResponse> {
    console.log('[AuthService] signUp called with:', { email: data.email, full_name: data.full_name });
    
    try {
      // Validate input
      if (!data.email || !data.password || !data.full_name) {
        console.error('[AuthService] Missing required fields');
        return {
          user: null,
          session: null,
          error: 'Email, password, and full name are required'
        };
      }

      console.log('[AuthService] Calling Supabase signUp...');
      console.log('[AuthService] Supabase URL:', supabaseUrl);
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name
          }
        }
      });

      console.log('[AuthService] Supabase response:', { 
        user: authData?.user?.id, 
        session: !!authData?.session,
        error: error?.message,
        errorDetails: error 
      });

      if (error) {
        console.error('[AuthService] Sign up error:', error);
        console.error('[AuthService] Error name:', error.name);
        console.error('[AuthService] Error status:', error.status);
        return { user: null, session: null, error: error.message };
      }

      if (!authData.user) {
        console.error('[AuthService] No user returned from Supabase');
        return {
          user: null,
          session: null,
          error: 'Failed to create user account'
        };
      }

      // Log authentication event (don't fail signup if this fails)
      try {
        await AuditLogService.logAuthEvent(
          'LOGIN',
          authData.user.id,
          undefined,
          undefined,
          { action: 'sign_up', email: data.email }
        );
      } catch (logError) {
        console.error('[AuthService] Failed to log auth event:', logError);
      }

      console.log('[AuthService] Sign up successful');
      return {
        user: authData.user as User,
        session: authData.session,
        error: null
      };

    } catch (error) {
      console.error('[AuthService] Sign up service error:', error);
      console.error('[AuthService] Error type:', typeof error);
      console.error('[AuthService] Error details:', JSON.stringify(error, null, 2));
      
      // Check if it's a network error
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          user: null,
          session: null,
          error: 'Network error: Unable to connect to Supabase. Please check your internet connection and try again.'
        };
      }
      
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Sign up failed. Please try again.'
      };
    }
  }

  /**
   * Sign in an existing user
   */
  static async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });

      if (error) {
        console.error('Sign in error:', error);
        return { user: null, session: null, error: error.message };
      }

      // Log authentication event
      if (authData.user) {
        await AuditLogService.logAuthEvent(
          'LOGIN',
          authData.user.id,
          undefined,
          undefined,
          { action: 'sign_in', email: data.email }
        );
      }

      return {
        user: authData.user as User,
        session: authData.session,
        error: null
      };

    } catch (error) {
      console.error('Sign in service error:', error);
      return {
        user: null,
        session: null,
        error: error instanceof Error ? error.message : 'Sign in failed'
      };
    }
  }

  /**
   * Sign out the current user
   */
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await AuditLogService.logAuthEvent(
          'LOGOUT',
          user.id,
          undefined,
          undefined,
          { action: 'sign_out' }
        );
      }

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        return { error: error.message };
      }

      return { error: null };

    } catch (error) {
      console.error('Sign out service error:', error);
      return { error: error instanceof Error ? error.message : 'Sign out failed' };
    }
  }

  /**
   * Get current user
   */
  static async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('Get user error:', error);
        return null;
      }

      return user as User;

    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Get current session
   */
  static async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Get session error:', error);
        return null;
      }

      return session;

    } catch (error) {
      console.error('Get current session error:', error);
      return null;
    }
  }

  /**
   * Create user profile
   */
  static async createUserProfile(userId: string, profileData: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      // For now, return a mock profile since we'll implement full profiles later
      console.log('Creating user profile for:', userId, profileData);
      
      return {
        id: userId,
        user_id: userId,
        full_name: profileData.full_name || '',
        job_title: profileData.job_title,
        company: profileData.company,
        experience_level: profileData.experience_level || 'entry',
        target_roles: profileData.target_roles || [],
        skills: profileData.skills || [],
        bio: profileData.bio,
        linkedin_url: profileData.linkedin_url,
        github_url: profileData.github_url,
        portfolio_url: profileData.portfolio_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserProfile;

    } catch (error) {
      console.error('Create user profile error:', error);
      return null;
    }
  }

  /**
   * Get user profile
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // For now, return a mock profile since we'll implement full profiles later
      console.log('Getting user profile for:', userId);
      
      return {
        id: userId,
        user_id: userId,
        full_name: 'User',
        job_title: 'Professional',
        company: undefined,
        experience_level: 'entry',
        target_roles: [],
        skills: [],
        bio: undefined,
        linkedin_url: undefined,
        github_url: undefined,
        portfolio_url: undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserProfile;

    } catch (error) {
      console.error('Get user profile error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      console.log('Updating user profile for:', userId, updates);

      // Log profile update
      await AuditLogService.logAuditEvent(
        'PROFILE_UPDATED',
        'profiles',
        userId,
        userId,
        undefined,
        updates
      );

      // Return updated mock profile
      return {
        id: userId,
        user_id: userId,
        full_name: updates.full_name || 'User',
        job_title: updates.job_title || 'Professional',
        company: updates.company,
        experience_level: updates.experience_level || 'entry',
        target_roles: updates.target_roles || [],
        skills: updates.skills || [],
        bio: updates.bio,
        linkedin_url: updates.linkedin_url,
        github_url: updates.github_url,
        portfolio_url: updates.portfolio_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as UserProfile;

    } catch (error) {
      console.error('Update user profile error:', error);
      return null;
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        console.error('Reset password error:', error);
        return { error: error.message };
      }

      return { error: null };

    } catch (error) {
      console.error('Reset password service error:', error);
      return { error: error instanceof Error ? error.message : 'Password reset failed' };
    }
  }

  /**
   * Update password
   */
  static async updatePassword(newPassword: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Update password error:', error);
        return { error: error.message };
      }

      // Log password update
      const user = await this.getCurrentUser();
      if (user) {
        await AuditLogService.logAuditEvent(
          'UPDATE',
          'auth_users',
          user.id,
          user.id,
          undefined,
          { action: 'password_updated' }
        );
      }

      return { error: null };

    } catch (error) {
      console.error('Update password service error:', error);
      return { error: error instanceof Error ? error.message : 'Password update failed' };
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const session = await this.getCurrentSession();
      return !!session;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(userId: string): Promise<{
    totalAnalyses: number;
    totalPredictions: number;
    averageScore: number;
    joinedDate: string;
    lastActivity: string;
  }> {
    try {
      // This would typically make parallel calls to get user-specific stats
      // For now, return mock data structure
      return {
        totalAnalyses: 0,
        totalPredictions: 0,
        averageScore: 0,
        joinedDate: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
    } catch (error) {
      console.error('Get user stats error:', error);
      throw error;
    }
  }
}