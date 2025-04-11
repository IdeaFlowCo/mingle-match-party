
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
        <p className="text-sm font-medium mb-2">RSVP to this event:</p>
        
        {isLoggedIn ? (
          <ToggleGroup type="single" value={userRsvpStatus || undefined} className="flex gap-2">
            <ToggleGroupItem 
              value="going" 
              onClick={() => onRsvpClick('going')}
              className={`flex items-center gap-1 ${userRsvpStatus === 'going' ? 'bg-green-100' : ''}`}
              variant="outline"
            >
              <Check className="h-4 w-4" />
              Yes
            </ToggleGroupItem>
            
            <ToggleGroupItem 
              value="maybe" 
              onClick={() => onRsvpClick('maybe')}
              className={`flex items-center gap-1 ${userRsvpStatus === 'maybe' ? 'bg-yellow-100' : ''}`}
              variant="outline"
            >
              <HelpCircle className="h-4 w-4" />
              Maybe
            </ToggleGroupItem>
            
            <ToggleGroupItem 
              value="not_going" 
              onClick={() => onRsvpClick('not_going')}
              className={`flex items-center gap-1 ${userRsvpStatus === 'not_going' ? 'bg-red-100' : ''}`}
              variant="outline"
            >
              <X className="h-4 w-4" />
              No
            </ToggleGroupItem>
          </ToggleGroup>
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
