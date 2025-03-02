
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

type Profile = {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  username: string;
  created_at: string;
  updated_at: string;
};

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signUp: (email: string, password: string, username: string, fullName: string, phoneNumber: string) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    username: string,
    fullName: string,
    phoneNumber: string
  ) => {
    try {
      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (existingUser) {
        toast({
          title: "Username already taken",
          description: "Please choose a different username",
          variant: "destructive",
        });
        return;
      }

      // Sign up with email and password (using without email verification)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            full_name: fullName,
            phone_number: phoneNumber,
          },
          emailRedirectTo: window.location.origin + '/auth',
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please login now.",
      });
      
      // Sign out the user after registration so they have to log in explicitly
      await supabase.auth.signOut();
      
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      // First, find the email associated with the username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (profileError || !profileData) {
        toast({
          title: "Login failed",
          description: "Username not found",
          variant: "destructive",
        });
        return;
      }

      // Find all users
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', profileData.id)
        .single();

      if (userError || !userData) {
        toast({
          title: "Login failed",
          description: "Could not retrieve user information",
          variant: "destructive",
        });
        return;
      }

      // Get email from auth.users (requires admin access which we simulate here)
      const { data: emailData, error: emailError } = await supabase
        .rpc('get_user_email', { user_id: profileData.id });

      if (emailError || !emailData) {
        console.error('Error getting email:', emailError);
        toast({
          title: "Login failed",
          description: "Could not retrieve user email",
          variant: "destructive",
        });
        return;
      }

      // Now sign in with the email and password
      const { error } = await supabase.auth.signInWithPassword({
        email: emailData,
        password,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Check if username already exists if updating username
      if (updates.username && updates.username !== profile?.username) {
        const { data: existingUser, error: checkError } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', updates.username)
          .not('id', 'eq', user.id)
          .single();

        if (existingUser) {
          toast({
            title: "Username already taken",
            description: "Please choose a different username",
            variant: "destructive",
          });
          return;
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
