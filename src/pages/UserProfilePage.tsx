import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { User, Twitter, Phone, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Profile } from "@/types/profile";

const UserProfilePage = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get current user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
    };
    
    getSession();
    
    // Fetch the profile we want to display
    const fetchProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('superconnector_profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          throw error;
        }
        
        setProfile(data as Profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Could not load user profile.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId, toast]);

  const handleConnect = async () => {
    if (!currentUser || !profile) return;
    
    try {
      // Add a connection in both directions for a mutual connection
      const { error: error1 } = await supabase
        .from('connections')
        .upsert({
          user_id: currentUser.id,
          connection_id: profile.id,
        });
        
      const { error: error2 } = await supabase
        .from('connections')
        .upsert({
          user_id: profile.id,
          connection_id: currentUser.id,
        });
        
      if (error1 || error2) throw error1 || error2;
      
      toast({
        title: "Connected!",
        description: `You are now connected with ${profile.name}.`
      });
    } catch (error) {
      console.error('Error adding connection:', error);
      toast({
        title: "Connection failed",
        description: "Could not add connection. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col md:flex-row gap-8">
              <Skeleton className="h-40 w-40 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-8 w-48 mb-3" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-3/4" />
              </div>
            </div>
          ) : profile ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <Avatar className="h-40 w-40">
                    {profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.name || ''} />
                    ) : null}
                    <AvatarFallback className="text-4xl">{getInitials(profile.name || '')}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-4">{profile.name}</h1>
                    
                    {profile.phone && (
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <Phone className="h-4 w-4" />
                        {profile.phone}
                      </div>
                    )}
                    
                    {profile.twitter && (
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <Twitter className="h-4 w-4" />
                        {profile.twitter}
                      </div>
                    )}
                    
                    {profile.bio && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">About</h2>
                        <p className="text-gray-700">{profile.bio}</p>
                      </div>
                    )}
                    
                    {profile.lookingFor && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Looking For</h2>
                        <p className="text-gray-700">{profile.lookingFor}</p>
                      </div>
                    )}
                    
                    {profile.interests && profile.interests.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-2">Interests</h2>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.map((interest: string, index: number) => (
                            <span 
                              key={index} 
                              className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {currentUser && currentUser.id !== profile.id && (
                      <div className="mt-8">
                        <Button 
                          variant="outline"
                          onClick={handleConnect}
                        >
                          Connect
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold">User not found</h2>
              <p className="text-gray-600 mt-2">This profile doesn't exist or has been removed.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
