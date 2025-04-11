
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const CreateEventPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    time: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create an event.",
          variant: "destructive"
        });
        return;
      }
      
      // Format the datetime for Supabase
      const startDateTime = new Date(`${eventData.date}T${eventData.time}`);
      // Default end time is 2 hours after start time
      const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000);
      
      // Save event to Supabase
      const { data, error } = await supabase
        .from('superconnector_events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          location: eventData.location,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          creator_id: session.user.id
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Event created",
        description: "Your event has been successfully created."
      });
      
      // Navigate to the event page
      navigate(`/event?id=${data.id}`);
      
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error creating event",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-6 py-8 md:px-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={eventData.description}
                onChange={handleChange}
                placeholder="Describe your event"
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={eventData.location}
                onChange={handleChange}
                placeholder="Enter event location"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={eventData.date}
                    onChange={handleChange}
                    required
                  />
                  <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={eventData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="bg-superconnector-purple hover:bg-superconnector-purple-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateEventPage;
