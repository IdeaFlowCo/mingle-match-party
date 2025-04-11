
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface LoginFormProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  devLoginMode: boolean;
  setDevLoginMode: (mode: boolean) => void;
  setShowMagicLink: (show: boolean) => void;
  onGenerateMagicLink: () => void;
  onTestLogin: () => void;
}

const LoginForm = ({
  isLoading,
  setIsLoading,
  devLoginMode,
  setDevLoginMode,
  setShowMagicLink,
  onGenerateMagicLink,
  onTestLogin
}: LoginFormProps) => {
  const [phone, setPhone] = useState("");
  const [lastRequestTime, setLastRequestTime] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Starting magic link authentication process...");
      
      // Always use the specified email rather than generating one from the phone number
      const email = "apppublishing+superconnectortest@proton.me";
      console.log(`Using email address: ${email}`);
      
      // If dev login mode is enabled, skip sending the email and show the direct magic link
      if (devLoginMode) {
        console.log("Dev login mode enabled, generating direct magic link");
        onGenerateMagicLink();
        toast({
          title: "Dev login mode enabled",
          description: "Direct magic link generated. Click it to sign in."
        });
      } else {
        // Check if we need to enforce timeout (only for non-dev mode)
        const currentTime = Date.now();
        if (currentTime - lastRequestTime < 5000) { // 5 seconds timeout
          throw new Error("Please wait a few seconds before requesting another magic link");
        }
        
        // Normal flow - send the magic link email
        console.log("Calling supabase.auth.signInWithOtp...");
        
        const { data, error } = await supabase.auth.signInWithOtp({
          email: email
        });
        
        console.log("OTP response received:", data ? "Success" : "No data", error ? `Error: ${error.message}` : "No errors");
        
        if (error) throw error;
        
        // Update last request time
        setLastRequestTime(currentTime);
        
        console.log("Magic link sent successfully to", email);
        toast({
          title: "Magic link sent",
          description: "Check apppublishing+superconnectortest@proton.me for a magic link to sign in!"
        });
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
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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
            Dev Login Mode (Generate direct magic link)
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

export default LoginForm;
