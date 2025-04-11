
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
}

interface FormData {
  phone: string;
  name: string;
  twitter: string;
  bio: string;
  lookingFor: string;
}

const AuthModal = ({ isOpen, onOpenChange, onLogin }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState("signup");
  const [isLoading, setIsLoading] = useState(false);
  const [showDevLogin, setShowDevLogin] = useState(false);
  const [devLoginMode, setDevLoginMode] = useState(true); // Default to true for developer convenience
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    name: "",
    twitter: "",
    bio: "",
    lookingFor: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Starting magic link authentication process...");
      
      // Always use the specified email rather than generating one from the phone number
      const email = "apppublishing+superconnectortest@proton.me";
      console.log(`Using email address: ${email}`);
      
      // If user is signing up, we'll pass additional metadata
      const options = activeTab === "signup" 
        ? {
            data: {
              name: formData.name,
              phone: formData.phone
            }
          }
        : undefined;
      
      console.log(`Auth mode: ${activeTab}`, options ? "with user data" : "without user data");
      
      // If dev login mode is enabled, skip sending the email and show the dev login button directly
      if (devLoginMode) {
        console.log("Dev login mode enabled, skipping email sending");
        setShowDevLogin(true);
        toast({
          title: "Dev login mode enabled",
          description: "Email sending skipped. Use the Dev Login button to sign in."
        });
      } else {
        // Normal flow - send the magic link email
        console.log("Calling supabase.auth.signInWithOtp...");
        
        const { data, error } = await supabase.auth.signInWithOtp({
          email: email,
          options
        });
        
        console.log("OTP response received:", data ? "Success" : "No data", error ? `Error: ${error.message}` : "No errors");
        
        if (error) throw error;
        
        console.log("Magic link sent successfully to", email);
        toast({
          title: "Magic link sent",
          description: "Check apppublishing+superconnectortest@proton.me for a magic link to sign in!"
        });
        
        // Show the dev login button after successfully sending magic link
        setShowDevLogin(true);
      }
    } catch (error: any) {
      console.error("Auth error details:", error);
      toast({
        title: "Authentication error",
        description: error.message || "Failed to authenticate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      console.log("Authentication process completed");
    }
  };
  
  const handleTestLogin = async () => {
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

  const handleDevLogin = async () => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {activeTab === "signup" ? "Sign Up" : "Sign In"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="signup" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signup">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Your Number</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number" 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Magic link will be sent to: apppublishing+superconnectortest@proton.me
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="twitter">Your Twitter (optional)</Label>
                  <Input 
                    id="twitter"
                    value={formData.twitter}
                    onChange={handleChange}
                    placeholder="@username" 
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Your bio (optional)</Label>
                  <Textarea 
                    id="bio" 
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself and your interests"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lookingFor">What you're looking for (optional)</Label>
                  <Textarea 
                    id="lookingFor" 
                    value={formData.lookingFor}
                    onChange={handleChange}
                    placeholder="What kind of connections are you seeking?"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="devMode" 
                    checked={devLoginMode}
                    onCheckedChange={(checked) => setDevLoginMode(checked as boolean)} 
                  />
                  <label
                    htmlFor="devMode"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Dev Login Mode (Skip email sending)
                  </label>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Send magic link"}
                </Button>
                
                {/* Show Dev Login button after magic link is sent */}
                {showDevLogin && (
                  <Button 
                    type="button" 
                    variant="secondary"
                    className="w-full"
                    onClick={handleDevLogin}
                    disabled={isLoading}
                  >
                    Dev Login (Bypass Email Verification)
                  </Button>
                )}
                
                <div className="text-center mt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full"
                    onClick={handleTestLogin}
                    disabled={isLoading}
                  >
                    Test Login (Quick Access)
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="signin">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Your Number</Label>
                  <Input 
                    id="phone"
                    type="tel" 
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number" 
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Magic link will be sent to: apppublishing+superconnectortest@proton.me
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="devModeSignIn" 
                    checked={devLoginMode}
                    onCheckedChange={(checked) => setDevLoginMode(checked as boolean)} 
                  />
                  <label
                    htmlFor="devModeSignIn"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Dev Login Mode (Skip email sending)
                  </label>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Send magic link"}
                </Button>
                
                {/* Show Dev Login button after magic link is sent */}
                {showDevLogin && (
                  <Button 
                    type="button" 
                    variant="secondary"
                    className="w-full"
                    onClick={handleDevLogin}
                    disabled={isLoading}
                  >
                    Dev Login (Bypass Email Verification)
                  </Button>
                )}
                
                <div className="text-center mt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="w-full"
                    onClick={handleTestLogin}
                    disabled={isLoading}
                  >
                    Test Login (Quick Access)
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
