
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '@/components/auth/LoginForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { handleDevLogin } from '@/components/auth/utils/authHelpers';

// Mock dependencies
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn()
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithOtp: vi.fn()
    }
  }
}));

vi.mock('@/components/auth/utils/authHelpers', () => ({
  handleDevLogin: vi.fn()
}));

describe('LoginForm', () => {
  const defaultProps = {
    isLoading: false,
    setIsLoading: vi.fn(),
    devLoginMode: false,
    setDevLoginMode: vi.fn(),
    setShowMagicLink: vi.fn(),
    onGenerateMagicLink: vi.fn(),
    onTestLogin: vi.fn(),
    onLogin: vi.fn(),
    onOpenChange: vi.fn()
  };

  it('renders all form elements correctly', () => {
    render(<LoginForm {...defaultProps} />);
    
    // Check if form elements are present
    expect(screen.getByLabelText('Your Number')).toBeInTheDocument();
    expect(screen.getByLabelText(/Dev Login Mode/)).toBeInTheDocument();
    expect(screen.getByText('Send magic link')).toBeInTheDocument();
    expect(screen.getByText('Test Login (Quick Access)')).toBeInTheDocument();
  });
  
  it('updates phone state when input changes', () => {
    render(<LoginForm {...defaultProps} />);
    
    // Find phone input and change it
    const phoneInput = screen.getByLabelText('Your Number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    
    // Check if input value changed
    expect(phoneInput).toHaveValue('1234567890');
  });
  
  it('calls handleDevLogin when in dev login mode', async () => {
    render(<LoginForm {...defaultProps} devLoginMode={true} />);
    
    // Submit the form
    const submitButton = screen.getByText('Sign In Directly');
    fireEvent.click(submitButton);
    
    // Should call handleDevLogin
    expect(handleDevLogin).toHaveBeenCalled();
  });
  
  it('calls supabase.auth.signInWithOtp when not in dev mode', async () => {
    const mockSignInWithOtp = supabase.auth.signInWithOtp as any;
    mockSignInWithOtp.mockResolvedValue({
      data: {},
      error: null
    });
    
    render(<LoginForm {...defaultProps} />);
    
    // Submit the form
    const submitButton = screen.getByText('Send magic link');
    fireEvent.click(submitButton);
    
    // Should call signInWithOtp
    expect(mockSignInWithOtp).toHaveBeenCalledWith({
      email: 'apppublishing+superconnectortest@proton.me'
    });
    expect(toast).toHaveBeenCalled();
  });
});
