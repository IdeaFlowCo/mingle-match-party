
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const UserProfilePage = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);

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
            <div className="flex flex-col md:flex-row gap-8">
              <Avatar className="h-40 w-40">
                {profile.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt={profile.name} />
                ) : null}
                <AvatarFallback className="text-4xl">{getInitials(profile.name)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-4">{profile.name}</h1>
                
                {profile.bio && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">About</h2>
                    <p className="text-gray-700">{profile.bio}</p>
                  </div>
                )}
                
                {profile.interests && profile.interests.length > 0 && (
                  <div>
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
                
                <div className="mt-8">
                  <Button variant="outline">Connect</Button>
                </div>
              </div>
            </div>
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
