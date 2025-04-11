
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
    console.log("Starting dev login process (bypassing email verification)...");
    
    // Create a direct session for the user
    const email = "apppublishing+superconnectortest@proton.me";
    const devPassword = "devpassword123"; // Consistent password for dev login
    
    // For signup flow, create the user first if they don't exist
    if (activeTab === "signup") {
      console.log("Signup flow: Creating user if needed first");
      
      // Check if user exists by attempting to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: devPassword
      });
      
      // If login fails, user likely doesn't exist, so create them
      if (error) {
        console.log("User doesn't exist, creating new account");
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: devPassword,
          options: {
            data: {
              name: formData.name || "Dev User",
              phone: formData.phone || ""
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        // After creating the user, we need to sign them in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: devPassword
        });
        
        if (signInError) throw signInError;
      }
    } 
    // For signin flow, just attempt to sign in with the dev credentials
    else {
      console.log("Signin flow: Attempting to sign in with dev credentials");
      
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: devPassword
      });
      
      if (error) {
        // If login fails during signin flow, create the account as a fallback
        console.log("Sign in failed, creating account as fallback");
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: devPassword,
          options: {
            data: {
              name: "Dev User",
              phone: formData.phone || ""
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        // Then sign in with the newly created account
        const { error: retryError } = await supabase.auth.signInWithPassword({
          email: email,
          password: devPassword
        });
        
        if (retryError) throw retryError;
      }
    }
    
    console.log("Dev login successful");
    onLogin();
    onOpenChange(false);
    
    toast({
      title: "Dev login successful",
      description: "You're now logged in (magic link bypassed)"
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
    const password = "devpassword123";
    
    // Check if the user already exists by signing in
    let { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    // If the user doesn't exist, create them first
    if (error && error.message.includes("Invalid login credentials")) {
      console.log("User doesn't exist yet. Creating new user...");
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: "Dev User"
          }
        }
      });
      
      if (signUpError) throw signUpError;
      
      // Try logging in again after creating the user
      const { error: retryError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (retryError) throw retryError;
    } else if (error) {
      throw error;
    }
    
    // Generate a magic link URL - user exists at this point
    // Instead of using admin.generateLink which requires additional permissions,
    // use signInWithOtp to get a login link
    const { data: otpData, error: otpError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false // Don't try to create a new user
      }
    });
    
    if (otpError) throw otpError;
    
    console.log("Magic link generated successfully via OTP");
    
    // For demonstration purposes, we'll create a fake direct login URL
    // In a real app, the user would get this link in their email
    const baseUrl = window.location.origin;
    const fakeLoginLink = `${baseUrl}/auth/confirm?email=${encodeURIComponent(email)}&token=DEMO_TOKEN`;
    
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
