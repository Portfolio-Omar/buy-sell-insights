
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Moon, Sun, Monitor, PaintBrush, Type, Bell, Shield } from "lucide-react";

const Settings = () => {
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="container space-y-8 p-8 pt-6 animate-fadeIn">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your preferences</p>
        </div>
        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 transition-colors">
          Save Changes
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PaintBrush className="h-4 w-4" />
              <span>Appearance</span>
            </CardTitle>
            <CardDescription>
              Customize how the application looks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex space-x-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTheme("light")}
                  className="w-full"
                >
                  <Sun className="h-4 w-4 mr-2" /> Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTheme("dark")}
                  className="w-full"
                >
                  <Moon className="h-4 w-4 mr-2" /> Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setTheme("system")}
                  className="w-full"
                >
                  <Monitor className="h-4 w-4 mr-2" /> System
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Type className="h-4 w-4" />
              <span>Typography</span>
            </CardTitle>
            <CardDescription>
              Customize text appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select defaultValue="inter">
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inter">Inter</SelectItem>
                  <SelectItem value="roboto">Roboto</SelectItem>
                  <SelectItem value="poppins">Poppins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </CardTitle>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
              <Label htmlFor="notifications">Enable Notifications</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="analytics"
                checked={analytics}
                onCheckedChange={setAnalytics}
              />
              <Label htmlFor="analytics">Share Analytics</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security Settings</span>
          </CardTitle>
          <CardDescription>
            Manage your account security preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Two-Factor Authentication</Label>
            <Button variant="outline" className="w-full">
              Enable 2FA
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
