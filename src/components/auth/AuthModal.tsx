
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { handleTestLogin, handleDevLogin, generateMagicLink } from "./utils/authHelpers";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
}

const AuthModal = ({ isOpen, onOpenChange, onLogin }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState("signup");
  const [isLoading, setIsLoading] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [magicLink, setMagicLink] = useState("");
  const [devLoginMode, setDevLoginMode] = useState(true); // Default to true for developer convenience
  
  const handleOnDevLogin = () => {
    handleDevLogin(
      setIsLoading, 
      activeTab, 
      {}, // No form data needed for dev login
      onLogin, 
      onOpenChange
    );
  };
  
  const handleOnTestLogin = () => {
    handleTestLogin(setIsLoading, onLogin, onOpenChange);
  };

  const handleGenerateMagicLink = async () => {
    setIsLoading(true);
    try {
      const link = await generateMagicLink();
      setMagicLink(link);
      setShowMagicLink(true);
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
            <SignupForm 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              devLoginMode={devLoginMode}
              setDevLoginMode={setDevLoginMode}
              setShowMagicLink={setShowMagicLink}
              onGenerateMagicLink={handleGenerateMagicLink}
              onTestLogin={handleOnTestLogin}
            />
            
            {/* Show Magic Link after request */}
            {showMagicLink && magicLink && (
              <div className="mt-4 p-3 border rounded-md bg-muted/50">
                <p className="text-sm mb-2">Use this magic link to sign in instantly:</p>
                <a 
                  href={magicLink} 
                  className="text-primary underline text-sm break-all"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {magicLink}
                </a>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="signin">
            <LoginForm 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              devLoginMode={devLoginMode}
              setDevLoginMode={setDevLoginMode}
              setShowMagicLink={setShowMagicLink}
              onGenerateMagicLink={handleGenerateMagicLink}
              onTestLogin={handleOnTestLogin}
            />
            
            {/* Show Magic Link after request */}
            {showMagicLink && magicLink && (
              <div className="mt-4 p-3 border rounded-md bg-muted/50">
                <p className="text-sm mb-2">Use this magic link to sign in instantly:</p>
                <a 
                  href={magicLink} 
                  className="text-primary underline text-sm break-all"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {magicLink}
                </a>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
