import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  
  useEffect(() => {
    // Set up listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch profile data for the user
        fetchProfile(currentUser.id);
      } else {
        setProfile(null);
      }
    });
    
    // Check if user is logged in on load
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        // Fetch profile data for the user
        fetchProfile(currentUser.id);
      }
    };
    
    getSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('superconnector_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
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
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-semibold">
          Superconnector
        </Link>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/users">Users</Link>
        </Button>
      </div>
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
              <Link to="/profile">
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
