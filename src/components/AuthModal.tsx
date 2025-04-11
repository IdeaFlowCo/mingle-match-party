
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
}

// Define a separate interface for form data to prevent excessive type instantiation
interface FormData {
  phone: string;
  name: string;
  twitter: string;
  bio: string;
  lookingFor: string;
}

const AuthModal = ({ isOpen, onOpenChange, onLogin }: AuthModalProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signup");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    phone: "",
    name: "",
    twitter: "",
    bio: "",
    lookingFor: ""
  });
  const [signinPhone, setSigninPhone] = useState("");
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // In a real app with phone authentication, we would implement proper phone auth
      // For now, we'll simulate by checking if a user with this phone exists
      const { data, error } = await supabase
        .from('superconnector_profiles')
        .select('*')
        .eq('phone', signinPhone)
        .single();
      
      if (error) {
        throw new Error("No account found with this phone number. Please sign up instead.");
      }
      
      // Simulate successful sign in with test user
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123"
      });
      
      if (authError) throw authError;
      
      onLogin();
      onOpenChange(false);
      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${data.name || "User"}!`
      });
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication error",
        description: error.message || "Failed to authenticate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // First check if a user with this phone already exists
      const { data: existingUser } = await supabase
        .from('superconnector_profiles')
        .select('*')
        .eq('phone', formData.phone)
        .maybeSingle();
      
      if (existingUser) {
        // User exists, sign them in instead
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: "test@example.com",
          password: "password123"
        });
        
        if (authError) throw authError;
        
        onLogin();
        onOpenChange(false);
        toast({
          title: "Signed in successfully",
          description: `Welcome back, ${existingUser.name || "User"}!`
        });
        return;
      }
      
      // New user, proceed with signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${formData.phone.replace(/[^0-9]/g, '')}@example.com`,
        password: "password123",
        options: {
          data: {
            name: formData.name,
            phone: formData.phone
          }
        }
      });
      
      if (authError) throw authError;
      
      // Store additional profile data
      const { error: profileError } = await supabase
        .from('superconnector_profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          bio: formData.bio,
          twitter: formData.twitter,
          lookingFor: formData.lookingFor
        })
        .eq('id', authData.user?.id);
        
      if (profileError) throw profileError;
      
      onLogin();
      onOpenChange(false);
      navigate("/profile");
      toast({
        title: "Signed up successfully",
        description: "Welcome to Superconnector!"
      });
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication error",
        description: error.message || "Failed to authenticate. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestLogin = async () => {
    setIsLoading(true);
    
    try {
      // Use a test email and password for quick sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "test@example.com",
        password: "password123"
      });
      
      // If the user doesn't exist, sign up first
      if (error && error.message.includes("Invalid login credentials")) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: "test@example.com",
          password: "password123",
          options: {
            data: {
              name: "Test User",
              phone: "555-123-4567"
            }
          }
        });
        
        if (signUpError) throw signUpError;
        
        // Create a profile for the test user
        if (signUpData.user) {
          const { error: profileError } = await supabase
            .from('superconnector_profiles')
            .upsert({
              id: signUpData.user.id,
              name: "Test User",
              bio: "I'm a test user interested in technology, entrepreneurship, and design.",
              twitter: "@testuser",
              phone: "555-123-4567",
              lookingFor: "Connections in tech and startups",
              interests: ["Technology", "Startups", "Design", "Marketing"]
            });
            
          if (profileError) throw profileError;
        }
        
        // Try login again after creating the user
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: "test@example.com",
          password: "password123"
        });
        
        if (loginError) throw loginError;
      } else if (error) {
        throw error;
      }
      
      onLogin();
      onOpenChange(false);
      
      toast({
        title: "Test login successful",
        description: "You're signed in as a test user"
      });
    } catch (error: any) {
      console.error("Test login error:", error);
      toast({
        title: "Test login failed",
        description: error.message || "Could not log in as test user",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
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
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing up..." : "RSVP"}
                </Button>
                
                <div className="text-center">
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
            <form onSubmit={handleSignIn}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="signin-phone">Your Number</Label>
                  <Input 
                    id="signin-phone" 
                    type="tel" 
                    value={signinPhone}
                    onChange={(e) => setSigninPhone(e.target.value)}
                    placeholder="Enter your phone number" 
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Go"}
                </Button>
                
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
