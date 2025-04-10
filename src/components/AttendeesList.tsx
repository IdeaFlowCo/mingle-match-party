
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttendeeCard from "./AttendeeCard";

export interface Attendee {
  id: string;
  name: string;
  bio: string;
  isTopMatch?: boolean;
}

interface AttendeesListProps {
  attendees: Attendee[];
  totalCount: number;
  isLoggedIn: boolean;
  onSignInClick: () => void;
}

const AttendeesList = ({
  attendees,
  totalCount,
  isLoggedIn,
  onSignInClick,
}: AttendeesListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(false);
  
  const topMatches = attendees.filter(a => a.isTopMatch);
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Attendees ({totalCount})</h2>
      
      <Tabs defaultValue="matches" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="matches">Your Top Matches</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <TabsContent value="matches">
          {isLoggedIn ? (
            <div className="space-y-4">
              {topMatches.length > 0 ? (
                <>
                  {topMatches.map((attendee) => (
                    <AttendeeCard
                      key={attendee.id}
                      attendee={attendee}
                      isLoggedIn={isLoggedIn}
                    />
                  ))}
                  <div className="flex justify-center mt-6">
                    <Button variant="outline">Compute More</Button>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No matches found. Try updating your profile or interests.
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="mb-4">Sign in to see your top matches</p>
              <Button onClick={onSignInClick}>Sign in</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all">
          <div className="mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Looking for..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="secondary">Search</Button>
            </div>
            
            {isLoggedIn && (
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="auto-update"
                  checked={autoUpdate}
                  onChange={() => setAutoUpdate(!autoUpdate)}
                  className="mr-2"
                />
                <label htmlFor="auto-update" className="text-sm text-gray-600">
                  Auto update profile from query
                </label>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            {attendees.map((attendee) => (
              <AttendeeCard
                key={attendee.id}
                attendee={attendee}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendeesList;
