
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { handleTestLogin, handleDevLogin } from "./utils/authHelpers";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import DevLoginButton from "./DevLoginButton";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
}

const AuthModal = ({ isOpen, onOpenChange, onLogin }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState("signup");
  const [isLoading, setIsLoading] = useState(false);
  const [showDevLogin, setShowDevLogin] = useState(false);
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
              setShowDevLogin={setShowDevLogin}
              onDevLogin={handleOnDevLogin}
              onTestLogin={handleOnTestLogin}
            />
            
            {/* Show Dev Login button after magic link is sent */}
            {showDevLogin && (
              <DevLoginButton 
                onDevLogin={handleOnDevLogin}
                isLoading={isLoading}
              />
            )}
          </TabsContent>
          
          <TabsContent value="signin">
            <LoginForm 
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              devLoginMode={devLoginMode}
              setDevLoginMode={setDevLoginMode}
              setShowDevLogin={setShowDevLogin}
              onDevLogin={handleOnDevLogin}
              onTestLogin={handleOnTestLogin}
            />
            
            {/* Show Dev Login button after magic link is sent */}
            {showDevLogin && (
              <DevLoginButton 
                onDevLogin={handleOnDevLogin}
                isLoading={isLoading}
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
