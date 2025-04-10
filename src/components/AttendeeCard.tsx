
import { Button } from "@/components/ui/button";
import { type Attendee } from "./AttendeesList";

interface AttendeeCardProps {
  attendee: Attendee;
  isLoggedIn: boolean;
}

const AttendeeCard = ({ attendee, isLoggedIn }: AttendeeCardProps) => {
  return (
    <div className="flex justify-between items-center p-4 border rounded-md">
      <div>
        <h3 className="font-medium">{attendee.name}</h3>
        <p className="text-gray-600 text-sm">{attendee.bio}</p>
      </div>
      
      {isLoggedIn && (
        <Button 
          variant="secondary"
          className="whitespace-nowrap"
        >
          Request Intro
        </Button>
      )}
    </div>
  );
};

export default AttendeeCard;
