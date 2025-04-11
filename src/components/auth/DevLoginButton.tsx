
import { Button } from "@/components/ui/button";

interface DevLoginButtonProps {
  onDevLogin: () => void;
  isLoading: boolean;
}

const DevLoginButton = ({ onDevLogin, isLoading }: DevLoginButtonProps) => {
  return (
    <Button 
      type="button" 
      variant="secondary"
      className="w-full"
      onClick={onDevLogin}
      disabled={isLoading}
    >
      Dev Login (Bypass Email Verification)
    </Button>
  );
};

export default DevLoginButton;
