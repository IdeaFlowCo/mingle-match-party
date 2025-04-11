
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('superconnector_events')
          .select('*')
          .order('start_time', { ascending: true })
          .limit(6);
          
        if (error) {
          throw error;
        }
        
        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Superconnector</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Host events and connect with people who share your interests. 
            Our smart matching helps you find the most relevant connections at every event.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-superconnector-purple hover:bg-superconnector-purple-dark"
              asChild
            >
              <Link to="/create-event">Create an Event</Link>
            </Button>
          </div>
        </div>
        
        <div className="max-w-6xl w-full mx-auto">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="h-64">
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{event.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-start space-x-2 mb-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mt-0.5" />
                      <span>{format(new Date(event.start_time), "EEEE, MMMM d, yyyy")}</span>
                    </div>
                    {event.location && (
                      <div className="flex items-start space-x-2 mb-3 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span>{event.location}</span>
                      </div>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {event.description || "No description available"}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/event?id=${event.id}`}>
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-medium mb-2">No events yet</h3>
              <p className="text-gray-600 mb-6">Be the first to create an event!</p>
              <Button 
                className="bg-superconnector-purple hover:bg-superconnector-purple-dark"
                asChild
              >
                <Link to="/create-event">Create an Event</Link>
              </Button>
            </div>
          )}
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Create Events</h3>
            <p className="text-gray-600">
              Host events for any purpose and invite your community.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Smart Matching</h3>
            <p className="text-gray-600">
              Our algorithm suggests connections based on interests and goals.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Connection Requests</h3>
            <p className="text-gray-600">
              Find people with shared interests and request introductions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
