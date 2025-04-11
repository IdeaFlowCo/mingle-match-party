
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
    
    // First check if the user exists
    const { data: userData, error: userError } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: false
      }
    });
    
    if (userError) {
      console.log("User might not exist, attempting to create account first");
      
      // Create user if needed (for signup flow)
      if (activeTab === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email: email,
          password: "devpassword123", // Temporary password for dev environment
          options: {
            data: {
              name: formData.name || "Dev User",
              phone: formData.phone || ""
            }
          }
        });
        
        if (signUpError) throw signUpError;
      }
    }
    
    // Now manually create a session by forcing admin login (this simulates clicking the magic link)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: "devpassword123" // Must match the password used above
    });
    
    if (error) throw error;
    
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
