
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthModal from '@/components/auth/AuthModal';
import { handleTestLogin, handleDevLogin, generateMagicLink } from '@/components/auth/utils/authHelpers';

// Mock the auth helpers
vi.mock('@/components/auth/utils/authHelpers', () => ({
  handleTestLogin: vi.fn(),
  handleDevLogin: vi.fn(),
  generateMagicLink: vi.fn(() => Promise.resolve('http://fake-magic-link.com'))
}));

describe('AuthModal', () => {
  const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    onLogin: vi.fn(),
  };

  it('renders the signup form by default', () => {
    render(<AuthModal {...defaultProps} />);
    
    // Check if it renders the signup form first
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
  });
  
  it('can switch between signup and signin tabs', () => {
    render(<AuthModal {...defaultProps} />);
    
    // Click on the Sign In tab
    fireEvent.click(screen.getByRole('tab', { name: 'Sign In' }));
    
    // Check if it switched to signin form
    expect(screen.queryByLabelText('Your Name')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Your Number')).toBeInTheDocument();
  });
  
  it('triggers test login when test login button is clicked', () => {
    render(<AuthModal {...defaultProps} />);
    
    // Find and click the test login button
    const testLoginButton = screen.getByText('Test Login (Quick Access)');
    fireEvent.click(testLoginButton);
    
    // Check if handleTestLogin was called
    expect(handleTestLogin).toHaveBeenCalled();
  });
  
  it('shows different button text based on dev mode', () => {
    // Dev mode is enabled by default now
    render(<AuthModal {...defaultProps} />);
    
    // Should show "Sign Up Directly" for the signup tab in dev mode
    expect(screen.getByText('Sign Up Directly')).toBeInTheDocument();
    
    // Switch to signin tab
    fireEvent.click(screen.getByRole('tab', { name: 'Sign In' }));
    
    // Should show "Sign In Directly" for the signin tab in dev mode
    expect(screen.getByText('Sign In Directly')).toBeInTheDocument();
  });
});
