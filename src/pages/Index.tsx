
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Superconnector</h1>
        <p className="text-xl text-gray-600 max-w-2xl mb-10">
          Host events and connect with people who share your interests. 
          Our smart matching helps you find the most relevant connections at every event.
        </p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <Button 
            size="lg" 
            className="bg-superconnector-purple hover:bg-superconnector-purple-dark"
            asChild
          >
            <Link to="/create-event">Create an Event</Link>
          </Button>
          
          <Button size="lg" variant="outline" asChild>
            <Link to="/event">Browse Sample Event</Link>
          </Button>
        </div>
        
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
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
