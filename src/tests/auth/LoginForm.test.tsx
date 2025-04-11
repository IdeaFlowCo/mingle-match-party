
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '@/components/auth/LoginForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

describe('LoginForm', () => {
  it('renders all form elements correctly', () => {
    render(
      <LoginForm 
        isLoading={false}
        setIsLoading={vi.fn()}
        devLoginMode={false}
        setDevLoginMode={vi.fn()}
        setShowMagicLink={vi.fn()}
        onGenerateMagicLink={vi.fn()}
        onTestLogin={vi.fn()}
      />
    );
    
    // Check if form elements are present
    expect(screen.getByLabelText('Your Number')).toBeInTheDocument();
    expect(screen.getByLabelText(/Dev Login Mode/)).toBeInTheDocument();
    expect(screen.getByText('Send magic link')).toBeInTheDocument();
    expect(screen.getByText('Test Login (Quick Access)')).toBeInTheDocument();
  });
  
  it('updates phone state when input changes', () => {
    render(
      <LoginForm 
        isLoading={false}
        setIsLoading={vi.fn()}
        devLoginMode={false}
        setDevLoginMode={vi.fn()}
        setShowMagicLink={vi.fn()}
        onGenerateMagicLink={vi.fn()}
        onTestLogin={vi.fn()}
      />
    );
    
    // Find phone input and change it
    const phoneInput = screen.getByLabelText('Your Number');
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });
    
    // Check if input value changed
    expect(phoneInput).toHaveValue('1234567890');
  });
  
  it('calls onGenerateMagicLink when in dev login mode', async () => {
    const mockGenerateMagicLink = vi.fn();
    const mockSetIsLoading = vi.fn();
    
    render(
      <LoginForm 
        isLoading={false}
        setIsLoading={mockSetIsLoading}
        devLoginMode={true}
        setDevLoginMode={vi.fn()}
        setShowMagicLink={vi.fn()}
        onGenerateMagicLink={mockGenerateMagicLink}
        onTestLogin={vi.fn()}
      />
    );
    
    // Submit the form
    const submitButton = screen.getByText('Send magic link');
    fireEvent.click(submitButton);
    
    // Should call onGenerateMagicLink
    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
    expect(mockGenerateMagicLink).toHaveBeenCalled();
  });
  
  it('calls supabase.auth.signInWithOtp when not in dev mode', async () => {
    const mockSignInWithOtp = supabase.auth.signInWithOtp as any;
    mockSignInWithOtp.mockResolvedValue({
      data: {},
      error: null
    });
    
    render(
      <LoginForm 
        isLoading={false}
        setIsLoading={vi.fn()}
        devLoginMode={false}
        setDevLoginMode={vi.fn()}
        setShowMagicLink={vi.fn()}
        onGenerateMagicLink={vi.fn()}
        onTestLogin={vi.fn()}
      />
    );
    
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
