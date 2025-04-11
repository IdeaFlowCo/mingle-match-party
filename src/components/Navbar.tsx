
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import AuthModal from "./auth/AuthModal"; // Updated import path
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";
import { Profile } from "@/types/profile";
import { toast } from "@/hooks/use-toast";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile in a separate function to avoid blocking the auth state change
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );
    
    // THEN check for existing session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    };
    
    getSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('superconnector_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      setProfile(data as Profile);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      toast({
        title: "Signed out successfully"
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        variant: "destructive"
      });
    }
  };
  
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

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
        
        {user ? (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
            >
              Sign Out
            </Button>
            
            <Button variant="ghost" className="p-0" asChild>
              <Link to={profile ? `/user?id=${user.id}` : "/profile"}>
                <Avatar className="h-8 w-8">
                  {profile?.avatar_url ? (
                    <AvatarImage src={profile.avatar_url} alt={profile?.name} />
                  ) : null}
                  <AvatarFallback>{getInitials(profile?.name || user.email || "")}</AvatarFallback>
                </Avatar>
              </Link>
            </Button>
          </div>
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
            setIsAuthModalOpen(false);
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
