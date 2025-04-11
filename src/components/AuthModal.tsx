
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin?: () => void;
}

interface ExistingProfileResult {
  id: string;
}

const AuthModal = ({ isOpen, onOpenChange, onLogin }: AuthModalProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Check if user exists with this phone number
      const { data: existingProfile } = await supabase
        .from('superconnector_profiles')
        .select('id')
        .eq('phone', phone)
        .maybeSingle<ExistingProfileResult>();
      
      if (existingProfile) {
        // User exists, log them in with magic link
        await supabase.auth.signInWithOtp({
          email: `${phone}@superconnector.app`,
        });
        toast({
          title: "Check your email",
          description: "We've sent you a magic link to log in."
        });
      } else {
        // Create new user with magic link
        // For new users, we need a temporary password for the initial signup
        const tempPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        
        const { error: authError } = await supabase.auth.signUp({
          email: `${phone}@superconnector.app`,
          password: tempPassword, // Required parameter for signUp
          options: {
            data: {
              phone,
              name: name
            }
          }
        });

        if (authError) throw authError;
        
        toast({
          title: "Account created",
          description: "Check your email for a login link."
        });
      }
      
      onLogin?.();
    } catch (error) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Authentication</AlertDialogTitle>
          <AlertDialogDescription>
            Enter your name and phone number to sign up or sign in.
            We'll automatically create an account if you don't have one.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleLogin} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading ...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AuthModal;
