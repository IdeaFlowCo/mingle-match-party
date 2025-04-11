
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import EventDetails from "@/components/EventDetails";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

const EventPage = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("id");
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    
    checkAuth();
    
    // Fetch event details
    const fetchEvent = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('superconnector_events')
          .select('*, creator:creator_id(name)')
          .eq('id', eventId)
          .single();
          
        if (error) {
          throw error;
        }
        
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
        toast({
          title: "Error fetching event details",
          description: "Could not load event details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId, toast]);

  const handleRsvp = async () => {
    try {
      if (!isLoggedIn) {
        toast({
          title: "Authentication required",
          description: "Please sign in to RSVP for this event.",
          variant: "destructive"
        });
        return;
      }
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { error } = await supabase
        .from('superconnector_attendees')
        .upsert({
          event_id: eventId,
          user_id: session.user.id,
          rsvp_status: 'going'
        });
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "RSVP confirmed",
        description: "You're now registered for this event."
      });
    } catch (error) {
      console.error("Error with RSVP:", error);
      toast({
        title: "Error with RSVP",
        description: error.message || "Could not register for this event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatDateTime = (startTime: string, endTime: string) => {
    try {
      const start = new Date(startTime);
      const end = new Date(endTime);
      
      return `${format(start, "EEEE, MMMM d, yyyy")} · ${format(start, "h:mm a")} - ${format(end, "h:mm a")}`;
    } catch (e) {
      return "Date and time to be announced";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-6 py-8">
        {loading ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        ) : event ? (
          <EventDetails 
            title={event.title}
            description={event.description}
            location={event.location}
            dateTime={formatDateTime(event.start_time, event.end_time)}
            isLoggedIn={isLoggedIn}
            onRsvpClick={handleRsvp}
          />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Event not found</h2>
            <p className="text-gray-600 mt-2">This event doesn't exist or has been removed.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default EventPage;
