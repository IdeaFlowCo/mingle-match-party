
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import EventDetails from "@/components/EventDetails";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const EventPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const eventId = searchParams.get("id");
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userRsvpStatus, setUserRsvpStatus] = useState<string | null>(null);
  const [creator, setCreator] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const loggedIn = !!session;
      setIsLoggedIn(loggedIn);
      
      if (loggedIn && session?.user?.id) {
        setUserId(session.user.id);
        
        // Fetch user's RSVP status if logged in
        if (eventId) {
          const { data: rsvpData, error: rsvpError } = await supabase
            .from('superconnector_attendees')
            .select('rsvp_status')
            .eq('event_id', eventId)
            .eq('user_id', session.user.id)
            .single();
            
          if (!rsvpError && rsvpData) {
            setUserRsvpStatus(rsvpData.rsvp_status);
          }
        }
      }
    };
    
    checkAuth();
    
    // Fetch event details
    const fetchEvent = async () => {
      if (!eventId) {
        setLoading(false);
        setLoadError(true);
        return;
      }
      
      try {
        console.log("Fetching event with id:", eventId);
        
        // Fetch the event without trying to join with creator
        const { data, error } = await supabase
          .from('superconnector_events')
          .select('*')
          .eq('id', eventId)
          .single();
          
        if (error) {
          console.error("Error in supabase query:", error);
          throw error;
        }
        
        console.log("Fetched event data:", data);
        setEvent(data);
        
        // Separately fetch the creator's profile if we have creator_id
        if (data && data.creator_id) {
          const { data: creatorData, error: creatorError } = await supabase
            .from('superconnector_profiles')
            .select('name')
            .eq('id', data.creator_id)
            .single();
            
          if (!creatorError && creatorData) {
            setCreator(creatorData);
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setLoadError(true);
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

  const handleRsvp = async (status: 'going' | 'maybe' | 'not_going') => {
    try {
      if (!isLoggedIn) {
        toast({
          title: "Authentication required",
          description: "Please sign in to RSVP for this event.",
          variant: "destructive"
        });
        return;
      }
      
      if (!userId) {
        toast({
          title: "User ID not found",
          description: "Please sign in again.",
          variant: "destructive"
        });
        return;
      }
      
      const { error } = await supabase
        .from('superconnector_attendees')
        .upsert({
          event_id: eventId,
          user_id: userId,
          rsvp_status: status
        });
        
      if (error) {
        throw error;
      }
      
      setUserRsvpStatus(status);
      
      // Show appropriate message based on RSVP status
      let message = "";
      switch (status) {
        case 'going':
          message = "You're now registered for this event!";
          break;
        case 'maybe':
          message = "You've marked yourself as maybe attending.";
          break;
        case 'not_going':
          message = "You've declined this event.";
          break;
      }
      
      toast({
        title: "RSVP updated",
        description: message
      });
    } catch (error) {
      console.error("Error with RSVP:", error);
      toast({
        title: "Error with RSVP",
        description: "Could not update your RSVP status. Please try again.",
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

  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1 px-6 py-8 flex flex-col items-center justify-center">
          <div className="text-center py-12 max-w-md">
            <h2 className="text-2xl font-bold mb-2">Event not found</h2>
            <p className="text-gray-600 mb-6">This event doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')}>
              Return to Homepage
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
            userRsvpStatus={userRsvpStatus}
            onRsvpClick={handleRsvp}
            creatorName={creator?.name}
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
