
export interface Profile {
  id: string;
  name: string | null;
  bio: string | null;
  interests: string[] | null;
  avatar_url: string | null;
  phone: string | null;
  twitter: string | null;
  lookingFor: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ProfileData {
  name: string;
  phone: string;
  twitter: string;
  bio: string;
  lookingFor: string;
  avatar_url: string;
  interests?: string[];
  id?: string;
  created_at?: string;
  updated_at?: string;
}
