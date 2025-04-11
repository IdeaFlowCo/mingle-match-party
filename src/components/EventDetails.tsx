
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Check, X, HelpCircle } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface EventDetailsProps {
  title: string;
  description: string;
  location: string;
  dateTime: string;
  isLoggedIn: boolean;
  userRsvpStatus: string | null;
  onRsvpClick: (status: 'going' | 'maybe' | 'not_going') => void;
}

const EventDetails = ({
  title,
  description,
  location,
  dateTime,
  isLoggedIn,
  userRsvpStatus,
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
      
      <div className="mb-10">
        <h3 className="text-lg font-medium mb-3">Will you attend this event?</h3>
        
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 ${userRsvpStatus === 'going' ? 'bg-green-100 border-green-300 text-green-700' : ''}`}
              onClick={() => onRsvpClick('going')}
            >
              <Check className="h-4 w-4" />
              Yes
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 ${userRsvpStatus === 'maybe' ? 'bg-yellow-100 border-yellow-300 text-yellow-700' : ''}`}
              onClick={() => onRsvpClick('maybe')}
            >
              <HelpCircle className="h-4 w-4" />
              Maybe
            </Button>
            
            <Button 
              variant="outline"
              size="sm"
              className={`flex items-center gap-1 ${userRsvpStatus === 'not_going' ? 'bg-red-100 border-red-300 text-red-700' : ''}`}
              onClick={() => onRsvpClick('not_going')}
            >
              <X className="h-4 w-4" />
              No
            </Button>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Please sign in to RSVP for this event.
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
