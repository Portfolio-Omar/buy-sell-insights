
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Phone, Save, Shield } from "lucide-react";

const Profile = () => {
  const { user, profile, isLoading, updateProfile, signOut } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    username: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  // If user is not logged in, redirect to login page
  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Initialize form with profile data when profile is loaded
  if (profile && !isEditing && 
    (formData.fullName !== profile.full_name || 
     formData.phoneNumber !== profile.phone_number ||
     formData.username !== profile.username)) {
    setFormData({
      fullName: profile.full_name || "",
      phoneNumber: profile.phone_number || "",
      username: profile.username,
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        username: formData.username,
      });
      setIsEditing(false);
    } catch (error) {
      // Error is handled in the updateProfile function
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = () => {
    if (!profile?.full_name) return "U";
    return profile.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-2xl">{profile?.full_name || "User"}</CardTitle>
                    <CardDescription>@{profile?.username}</CardDescription>
                  </div>
                </div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                ) : (
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      className="w-full mt-4"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                      {!isSubmitting && <Save className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="font-medium text-muted-foreground">Full Name</h3>
                      <p className="text-lg">{profile?.full_name || "Not set"}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-muted-foreground">Username</h3>
                      <p className="text-lg">@{profile?.username}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-muted-foreground">Email</h3>
                      <p className="text-lg">{user?.email}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-muted-foreground">Phone Number</h3>
                      <p className="text-lg">{profile?.phone_number || "Not set"}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            {!isEditing && (
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={signOut}>
                  Sign Out
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
