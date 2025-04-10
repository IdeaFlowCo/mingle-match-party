
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
}

const AuthModal = ({ isOpen, onOpenChange, onLogin }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState("signup");
  const [isNewUser, setIsNewUser] = useState(true);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
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
                  <Input id="phone" type="tel" placeholder="Enter your phone number" />
                </div>
                
                <div>
                  <Label htmlFor="name">Your Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                
                <div>
                  <Label htmlFor="twitter">Your Twitter (optional)</Label>
                  <Input id="twitter" placeholder="@username" />
                </div>
                
                <div>
                  <Label htmlFor="bio">Your bio (optional)</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Tell us about yourself and your interests"
                  />
                </div>
                
                <div>
                  <Label htmlFor="looking-for">What you're looking for (optional)</Label>
                  <Textarea 
                    id="looking-for" 
                    placeholder="What kind of connections are you seeking?"
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  RSVP
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="signin">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="signin-phone">Your Number</Label>
                  <Input id="signin-phone" type="tel" placeholder="Enter your phone number" />
                </div>
                <Button type="submit" className="w-full">
                  Go
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
