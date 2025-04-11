
export interface Profile {
  id: string;
  name: string;
  avatar_url: string;
  bio: string;
  created_at: string;
  updated_at: string;
  interests: string[];
  phone?: string;
  twitter?: string;
  lookingFor?: string;
}
