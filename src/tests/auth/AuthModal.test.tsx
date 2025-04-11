
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
  it('renders the signup form by default', () => {
    render(
      <AuthModal 
        isOpen={true} 
        onOpenChange={() => {}} 
        onLogin={() => {}} 
      />
    );
    
    // Check if it renders the signup form first
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    expect(screen.getByLabelText('Your Name')).toBeInTheDocument();
  });
  
  it('can switch between signup and signin tabs', () => {
    render(
      <AuthModal 
        isOpen={true} 
        onOpenChange={() => {}} 
        onLogin={() => {}} 
      />
    );
    
    // Click on the Sign In tab
    fireEvent.click(screen.getByRole('tab', { name: 'Sign In' }));
    
    // Check if it switched to signin form
    expect(screen.queryByLabelText('Your Name')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Your Number')).toBeInTheDocument();
  });
  
  it('triggers test login when test login button is clicked', () => {
    render(
      <AuthModal 
        isOpen={true} 
        onOpenChange={vi.fn()} 
        onLogin={vi.fn()} 
      />
    );
    
    // Find and click the test login button
    const testLoginButton = screen.getByText('Test Login (Quick Access)');
    fireEvent.click(testLoginButton);
    
    // Check if handleTestLogin was called
    expect(handleTestLogin).toHaveBeenCalled();
  });
  
  it('shows magic link when generated', async () => {
    // Mock the generate magic link function
    (generateMagicLink as any).mockResolvedValue('http://example.com/magic-link');
    
    render(
      <AuthModal 
        isOpen={true} 
        onOpenChange={vi.fn()} 
        onLogin={vi.fn()} 
      />
    );
    
    // Find and click the "Send magic link" button
    const sendMagicLinkButton = screen.getByText('Send magic link');
    fireEvent.click(sendMagicLinkButton);
    
    // Wait for the magic link to appear
    const magicLinkElement = await screen.findByText((content) => 
      content.includes('magic link')
    );
    
    expect(magicLinkElement).toBeInTheDocument();
    expect(generateMagicLink).toHaveBeenCalled();
  });
});
