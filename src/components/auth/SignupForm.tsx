
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface FormData {
  phone: string;
  name: string;
  twitter: string;
  bio: string;
  lookingFor: string;
}

interface SignupFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  devLoginMode: boolean;
  setDevLoginMode: (mode: boolean) => void;
  setShowDevLogin: (show: boolean) => void;
  onDevLogin: () => void;
  onTestLogin: () => void;
}

const SignupForm = ({
  isLoading,
  setIsLoading,
  devLoginMode,
  setDevLoginMode,
  setShowDevLogin,
  onDevLogin,
  onTestLogin
}: SignupFormProps) => {
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
      
      // For signup, we'll pass additional metadata
      const options = {
        data: {
          name: formData.name,
          phone: formData.phone
        }
      };
      
      console.log(`Auth mode: signup`, options ? "with user data" : "without user data");
      
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

  return (
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
        
        <div className="text-center mt-4">
          <Button 
            type="button" 
            variant="outline"
            className="w-full"
            onClick={onTestLogin}
            disabled={isLoading}
          >
            Test Login (Quick Access)
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SignupForm;
