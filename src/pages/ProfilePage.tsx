
import { useState } from "react";
import TabBar from "@/components/layout/TabBar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  UserCircle, 
  Moon, 
  Download, 
  Upload, 
  LogOut, 
  Mail,
  FileDown
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [backupEnabled, setBackupEnabled] = useState(true);
  // Mock user data
  const user = {
    name: "John Smith",
    email: "john.smith@example.com"
  };

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const handleExport = () => {
    toast({
      title: "Data exported",
      description: "Your data has been exported successfully.",
    });
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast({
      title: `${!darkMode ? "Dark" : "Light"} mode enabled`,
      description: `App theme has been changed to ${!darkMode ? "dark" : "light"} mode.`,
    });
  };

  const toggleBackup = () => {
    setBackupEnabled(!backupEnabled);
    toast({
      title: `Data backup ${!backupEnabled ? "enabled" : "disabled"}`,
      description: `Automatic data backup has been ${!backupEnabled ? "enabled" : "disabled"}.`,
    });
  };

  return (
    <div className="pb-16 h-screen bg-gray-50">
      <div className="pt-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center">
              <UserCircle className="h-10 w-10 text-ios-blue mr-3" />
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription className="flex items-center">
                  <Mail className="h-3 w-3 mr-1" />
                  {user.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardFooter>
            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </CardFooter>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Moon className="h-5 w-5 mr-2 text-ios-blue" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <Switch 
                id="dark-mode" 
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Upload className="h-5 w-5 mr-2 text-ios-blue" />
                <Label htmlFor="backup">Automatic Backup</Label>
              </div>
              <Switch 
                id="backup" 
                checked={backupEnabled}
                onCheckedChange={toggleBackup}
              />
            </div>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleExport}
            >
              <FileDown className="h-4 w-4 mr-2" />
              Export All Data
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500 mt-10">
          <p>Tag It Together v1.0</p>
          <p className="mt-1">©2025 Lovable Inc.</p>
        </div>
      </div>

      <TabBar />
    </div>
  );
};

export default ProfilePage;
