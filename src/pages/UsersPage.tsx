
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  interests: string[];
}

const UsersPage = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('superconnector_profiles')
          .select('id, name, bio, avatar_url, interests')
          .order('name');
          
        if (error) throw error;
        
        setUsers(data || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error fetching users",
          description: "Could not load user list. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Users</h1>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="flex flex-col">
                  <CardContent className="pt-6 flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card key={user.id} className="flex flex-col">
                  <CardContent className="pt-6 flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="h-12 w-12">
                        {user.avatar_url ? (
                          <AvatarImage src={user.avatar_url} alt={user.name} />
                        ) : null}
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium line-clamp-1">{user.name || "Unnamed User"}</h3>
                      </div>
                    </div>
                    
                    {user.bio && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">{user.bio}</p>
                    )}
                    
                    {user.interests && user.interests.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.interests.slice(0, 3).map((interest, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {interest}
                          </span>
                        ))}
                        {user.interests.length > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{user.interests.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/user?id=${user.id}`}>
                        View Profile <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <h2 className="text-xl font-medium mb-2">No users found</h2>
              <p className="text-gray-600">There are no users in the system yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UsersPage;
