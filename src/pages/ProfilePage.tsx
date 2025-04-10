
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    phone: "555-123-4567",
    twitter: "@johndoe",
    bio: "Excited about Tai chi, surfing, connecting people. From San Diego",
    lookingFor: "Looking for Full stack engineer"
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save profile logic would go here
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated."
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-6 py-8 md:px-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Profile</h1>
          
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
              className="bg-superconnector-purple hover:bg-superconnector-purple-dark"
            >
              Save Profile
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
