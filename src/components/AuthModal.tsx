
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
      // Always use the specified email rather than generating one from the phone number
      const email = "apppublishing+superconnectortest@proton.me";
      
      // If user is signing up, we'll pass additional metadata
      const options = activeTab === "signup" 
        ? {
            data: {
              name: formData.name,
              phone: formData.phone
            }
          }
        : undefined;
      
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options
      });
      
      if (error) throw error;
      
      toast({
        title: "Magic link sent",
        description: "Check apppublishing+superconnectortest@proton.me for a magic link to sign in!"
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
              bio: "I'm a test user interested in technology, entrepreneurship, and design."
            }
          }
        });
        
        if (signUpError) throw signUpError;
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
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending magic link..." : "Send magic link"}
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending magic link..." : "Send magic link"}
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
