
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <nav className="w-full py-4 px-6 md:px-12 flex items-center justify-between border-b">
      <Link to="/" className="text-xl font-semibold">
        Superconnector
      </Link>
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          asChild
        >
          <Link to="/create-event">+ Create Event</Link>
        </Button>
        
        {isLoggedIn ? (
          <Button variant="ghost" asChild>
            <Link to="/profile">My Profile</Link>
          </Button>
        ) : (
          <Button 
            variant="ghost"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Sign in
          </Button>
        )}
        
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onOpenChange={setIsAuthModalOpen}
          onLogin={() => {
            setIsLoggedIn(true);
            setIsAuthModalOpen(false);
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
