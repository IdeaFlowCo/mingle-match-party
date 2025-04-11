
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, User, Twitter, Phone, Pencil } from "lucide-react";

// Define extended profile data interface with the additional fields
interface ExtendedProfileData {
  name: string;
  phone: string;
  twitter: string;
  bio: string;
  lookingFor: string;
  avatar_url: string;
  // Add other fields that might be in the database
  id?: string;
  created_at?: string;
  updated_at?: string;
  interests?: string[];
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ExtendedProfileData>({
    name: "",
    phone: "",
    twitter: "",
    bio: "",
    lookingFor: "",
    avatar_url: ""
  });
  
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/");
        return;
      }
      
      setUser(session.user);
      fetchProfile(session.user.id);
    };
    
    getSession();
  }, [navigate]);
  
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('superconnector_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setProfileData({
          name: data.name || "",
          phone: data.phone || "",
          twitter: data.twitter || "",
          bio: data.bio || "",
          lookingFor: data.lookingFor || "",
          avatar_url: data.avatar_url || "",
          interests: data.interests,
          id: data.id,
          created_at: data.created_at,
          updated_at: data.updated_at
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Error fetching profile",
        description: "Could not load your profile information.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (!user) throw new Error("No user logged in");
      
      const { error } = await supabase
        .from('superconnector_profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone,
          twitter: profileData.twitter,
          bio: profileData.bio,
          lookingFor: profileData.lookingFor
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-6 py-8 md:px-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Profile</h1>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setEditing(!editing)}
            >
              {editing ? "Cancel" : (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
          
          {!editing ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="h-24 w-24">
                    {profileData.avatar_url ? (
                      <AvatarImage src={profileData.avatar_url} alt={profileData.name} />
                    ) : null}
                    <AvatarFallback className="text-2xl">{getInitials(profileData.name)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-4 flex-1">
                    <div>
                      <h2 className="text-2xl font-semibold">{profileData.name}</h2>
                    </div>
                    
                    {profileData.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        {profileData.phone}
                      </div>
                    )}
                    
                    {profileData.twitter && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Twitter className="h-4 w-4" />
                        {profileData.twitter}
                      </div>
                    )}
                    
                    {profileData.bio && (
                      <div className="pt-2">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Bio</h3>
                        <p className="text-gray-700">{profileData.bio}</p>
                      </div>
                    )}
                    
                    {profileData.lookingFor && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Looking for</h3>
                        <p className="text-gray-700">{profileData.lookingFor}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Your Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter">Your Twitter (optional)</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={profileData.twitter}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Your Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={profileData.bio}
                  onChange={handleChange}
                  placeholder="Tell others about yourself and your interests"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lookingFor">What You're Looking For</Label>
                <Textarea
                  id="lookingFor"
                  name="lookingFor"
                  rows={4}
                  value={profileData.lookingFor}
                  onChange={handleChange}
                  placeholder="What connections are you hoping to make?"
                />
              </div>
              
              <Button 
                type="submit" 
                className="flex gap-2 items-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
