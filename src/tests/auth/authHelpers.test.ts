
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleTestLogin, handleDevLogin, generateMagicLink } from '@/components/auth/utils/authHelpers';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock dependencies
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOtp: vi.fn()
    }
  }
}));

describe('Auth Helpers', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'http://localhost:8080'
      },
      writable: true
    });
  });
  
  describe('handleTestLogin', () => {
    it('should handle successful test login', async () => {
      // Mock successful login
      const mockSignIn = supabase.auth.signInWithPassword as any;
      mockSignIn.mockResolvedValue({
        data: { user: { id: 'test-user-id' } },
        error: null
      });
      
      const setIsLoading = vi.fn();
      const onLogin = vi.fn();
      const onOpenChange = vi.fn();
      
      await handleTestLogin(setIsLoading, onLogin, onOpenChange);
      
      // Verify function behavior
      expect(setIsLoading).toHaveBeenCalledWith(true);
      expect(setIsLoading).toHaveBeenCalledWith(false);
      expect(onLogin).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
      expect(toast).toHaveBeenCalled();
      expect(mockSignIn).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123"
      });
    });
    
    it('should handle test user creation when login fails', async () => {
      // First login fails, then signup succeeds
      const mockSignIn = supabase.auth.signInWithPassword as any;
      mockSignIn.mockResolvedValueOnce({
        data: null,
        error: { message: 'Invalid login credentials' }
      }).mockResolvedValueOnce({
        data: { user: { id: 'new-test-user-id' } },
        error: null
      });
      
      const mockSignUp = supabase.auth.signUp as any;
      mockSignUp.mockResolvedValue({
        data: { user: { id: 'new-test-user-id' } },
        error: null
      });
      
      const setIsLoading = vi.fn();
      const onLogin = vi.fn();
      const onOpenChange = vi.fn();
      
      await handleTestLogin(setIsLoading, onLogin, onOpenChange);
      
      // Verify signup was called
      expect(mockSignUp).toHaveBeenCalled();
      expect(setIsLoading).toHaveBeenCalledWith(false);
      expect(onLogin).toHaveBeenCalled();
    });
  });
  
  describe('generateMagicLink', () => {
    it('should generate a magic link without checking user existence first', async () => {
      // Mock OTP generation
      const mockSignInWithOtp = supabase.auth.signInWithOtp as any;
      mockSignInWithOtp.mockResolvedValue({
        data: {},
        error: null
      });
      
      const link = await generateMagicLink();
      
      // Should return a link for the demo
      expect(link).toContain('http://localhost:8080/auth/confirm');
      expect(mockSignInWithOtp).toHaveBeenCalledWith({
        email: 'apppublishing+superconnectortest@proton.me',
        options: { shouldCreateUser: true }
      });
      
      // Should NOT have called signInWithPassword
      expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled();
    });
    
    it('should handle errors when generating magic link', async () => {
      // Mock OTP generation failure
      const mockSignInWithOtp = supabase.auth.signInWithOtp as any;
      mockSignInWithOtp.mockResolvedValue({
        data: null,
        error: { message: 'Failed to send email' }
      });
      
      const link = await generateMagicLink();
      
      // Should return empty string when error occurs
      expect(link).toBe('');
      expect(toast).toHaveBeenCalled();
    });
  });
  
  // Add more tests for handleDevLogin as needed
});
