
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";

interface EventDetailsProps {
  title: string;
  description: string;
  location: string;
  dateTime: string;
  isLoggedIn: boolean;
  onRsvpClick: () => void;
}

const EventDetails = ({
  title,
  description,
  location,
  dateTime,
  isLoggedIn,
  onRsvpClick,
}: EventDetailsProps) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">{title}</h1>
      
      <div className="space-y-4 mb-8">
        <p className="text-gray-700">{description}</p>
        
        <div className="flex items-center text-gray-600">
          <MapPin className="h-5 w-5 mr-2" />
          <span>{location}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Calendar className="h-5 w-5 mr-2" />
          <Clock className="h-5 w-5 mr-2" />
          <span>{dateTime}</span>
        </div>
      </div>
      
      <div className="flex space-x-4 mb-10">
        <Button 
          onClick={onRsvpClick}
          className="bg-superconnector-purple hover:bg-superconnector-purple-dark"
        >
          RSVP - Yes
        </Button>
        <Button variant="outline">Maybe</Button>
        <Button variant="ghost">No</Button>
      </div>
    </div>
  );
};

export default EventDetails;
