
import { useState } from "react";
import Navbar from "@/components/Navbar";
import EventDetails from "@/components/EventDetails";
import AttendeesList, { Attendee } from "@/components/AttendeesList";
import AuthModal from "@/components/AuthModal";

const mockAttendees: Attendee[] = [
  {
    id: "1",
    name: "Homen Shun",
    bio: "Excited about Tai chi, surfing, connecting people",
    isTopMatch: true
  },
  {
    id: "2",
    name: "Eden Chan",
    bio: "Excited about Tai chi, surfing, connecting people",
    isTopMatch: true
  },
  {
    id: "3",
    name: "Lily Johnson",
    bio: "Passionate about AI, cooking, and outdoor adventures"
  },
  {
    id: "4",
    name: "Marco Polo",
    bio: "Travel enthusiast, startup founder, looking for co-founders"
  }
];

const EventPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const handleRsvpClick = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      // Handle RSVP logic
    }
  };
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 px-6 py-8 md:px-12">
        <EventDetails
          title="Stanford Salon"
          description="A gathering of minds to discuss technology, art, and the future."
          location="Stanford University, Palo Alto, CA"
          dateTime="Apr 15, 2025, 6:00 PM - 9:00 PM"
          isLoggedIn={isLoggedIn}
          onRsvpClick={handleRsvpClick}
        />
        
        <AttendeesList
          attendees={mockAttendees}
          totalCount={34}
          isLoggedIn={isLoggedIn}
          onSignInClick={() => setIsAuthModalOpen(true)}
        />
      </main>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        onLogin={handleLogin}
      />
    </div>
  );
};

export default EventPage;
