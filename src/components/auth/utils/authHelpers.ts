import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const handleTestLogin = async (
  setIsLoading: (loading: boolean) => void,
  onLogin: () => void,
  onOpenChange: (open: boolean) => void
) => {
  setIsLoading(true);
  
  try {
    console.log("Starting test login process...");
    
    // Use a test email and password for quick sign in
    console.log("Attempting to sign in with test credentials...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "test@example.com",
      password: "password123"
    });
    
    console.log("Sign in response:", data ? "Success" : "No data", error ? `Error: ${error.message}` : "No errors");
    
    // If the user doesn't exist, sign up first
    if (error && error.message.includes("Invalid login credentials")) {
      console.log("Test user doesn't exist, creating new test user...");
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: "test@example.com",
        password: "password123",
        options: {
          data: {
            name: "Test User",
            bio: "I'm a test user interested in technology, entrepreneurship, and design."
          }
        }
      });
      
      console.log("Sign up response:", signUpData ? "Success" : "No data", signUpError ? `Error: ${signUpError.message}` : "No errors");
      
      if (signUpError) throw signUpError;
    } else if (error) {
      throw error;
    }
    
    console.log("Test login successful, triggering onLogin callback");
    onLogin();
    onOpenChange(false);
    
    toast({
      title: "Test login successful",
      description: "You're signed in as a test user"
    });
  } catch (error: any) {
    console.error("Test login error details:", error);
    toast({
      title: "Test login failed",
      description: error.message || "Could not log in as test user",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
    console.log("Test login process completed");
  }
};

export const handleDevLogin = async (
  setIsLoading: (loading: boolean) => void,
  activeTab: string,
  formData: { name?: string, phone?: string },
  onLogin: () => void,
  onOpenChange: (open: boolean) => void
) => {
  setIsLoading(true);
  
  try {
    console.log("Starting dev login process (bypassing actual authentication)...");
    
    // In dev mode, instead of trying to authenticate with Supabase,
    // we'll manually create a session by directly injecting it into
    // localStorage to simulate being logged in
    
    // Create a mock user object
    const mockUser = {
      id: "dev-user-id-12345",
      email: "apppublishing+superconnectortest@proton.me",
      phone: formData.phone || "",
      user_metadata: {
        name: formData.name || "Dev User",
        phone: formData.phone || ""
      },
      app_metadata: {
        provider: "email"
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Create a mock session
    const mockSession = {
      access_token: "mock-access-token-for-dev-mode",
      refresh_token: "mock-refresh-token-for-dev-mode",
      expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      user: mockUser
    };
    
    // Store the mock session in localStorage directly
    // This will trigger the onAuthStateChange listener in the Navbar component
    localStorage.setItem('sb-session', JSON.stringify(mockSession));
    
    // Manually trigger an auth state change to update the UI
    // This emits an event that the onAuthStateChange listener will pick up
    window.dispatchEvent(new Event('sb-auth-state-change'));
    
    console.log("Dev login successful with mock session");
    onLogin();
    onOpenChange(false);
    
    toast({
      title: "Dev login successful",
      description: "You're now logged in (authentication bypassed)"
    });
  } catch (error: any) {
    console.error("Dev login error details:", error);
    toast({
      title: "Dev login failed",
      description: error.message || "Could not complete dev login",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
    console.log("Dev login process completed");
  }
};

export const generateMagicLink = async (): Promise<string> => {
  console.log("Generating direct magic link...");
  
  try {
    const email = "apppublishing+superconnectortest@proton.me";
    
    // For a magic link, we don't need to check if the user exists first
    // We'll let signInWithOtp handle that automatically - it works for both
    // existing users (sign in) and new users (sign up)
    console.log("Generating magic link via OTP for:", email);
    
    // Generate a magic link URL - signInWithOtp works for both new and existing users
    const { data: otpData, error: otpError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // Set to true to create user if they don't exist (for signup tab)
        // Set to false to only allow existing users (for signin tab)
        // Since we're using the same function for both, we'll allow user creation
        shouldCreateUser: true
      }
    });
    
    if (otpError) throw otpError;
    
    console.log("Magic link generated successfully via OTP");
    
    // For demonstration purposes in dev mode, we'll create a more realistic magic link
    // In a real app, the user would get this link in their email
    const baseUrl = window.location.origin;
    
    // Generate a realistic-looking token (not an actual token)
    const randomToken = generateRandomToken();
    const fakeLoginLink = `${baseUrl}/auth/confirm?email=${encodeURIComponent(email)}&token=${randomToken}`;
    
    // In a real application, return "" since the link is emailed
    // For demo, return the fake link that will work with our auth flow
    return fakeLoginLink;
    
  } catch (error: any) {
    console.error("Error generating magic link:", error);
    toast({
      title: "Error generating magic link",
      description: error.message || "Could not generate magic link",
      variant: "destructive"
    });
    return ""; // Return empty string if failed
  }
};

// Helper function to generate a random token that looks like a real token
function generateRandomToken(): string {
  // Generate a realistic looking token
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  
  // First part (32 chars)
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  // Add a dash
  token += "-";
  
  // Second part (6 chars)
  for (let i = 0; i < 6; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return token;
}
