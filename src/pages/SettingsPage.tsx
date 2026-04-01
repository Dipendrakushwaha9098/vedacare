import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const SettingsPage = () => {
  const { user, logout } = useAuth();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [formChanged, setFormChanged] = useState(false);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // ✅ Load settings from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("settings");
    if (stored) {
      const data = JSON.parse(stored);
      setIsDarkMode(data.darkMode);
      setNotificationsEnabled(data.notifications);
    }
  }, []);

  // ✅ Apply Dark Mode
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // ✅ Toggle Function
  const handleToggle = (setter: Dispatch<SetStateAction<boolean>>) => {
    setter((prev) => !prev);
    setFormChanged(true);
  };

  // ✅ Save Settings
  const handleSave = () => {
    const data = {
      darkMode: isDarkMode,
      notifications: notificationsEnabled,
    };

    localStorage.setItem("settings", JSON.stringify(data));
    setNotification("Settings saved!");
    setFormChanged(false);

    setTimeout(() => setNotification(null), 3000);
  };

  // ✅ Export Data
  const handleExport = () => {
    const data = localStorage.getItem("settings");

    const blob = new Blob([data || "{}"], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "settings.json";
    a.click();
  };

  // ✅ Logout
  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen p-6 space-y-6">

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 bg-green-100 px-4 py-2 rounded">
          {notification}
        </div>
      )}

      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Dark Mode */}
      <Card className="p-4">
        <div className="flex justify-between">
          <span>Dark Mode</span>
          <button onClick={() => handleToggle(setIsDarkMode)}>
            {isDarkMode ? "ON 🌙" : "OFF ☀️"}
          </button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-4">
        <div className="flex justify-between">
          <span>Notifications</span>
          <button onClick={() => handleToggle(setNotificationsEnabled)}>
            {notificationsEnabled ? "ON 🔔" : "OFF 🔕"}
          </button>
        </div>
      </Card>

      {/* Export */}
      <Button onClick={handleExport}>
        Export Settings
      </Button>

      {/* Save */}
      {formChanged && (
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      )}

      {/* Logout */}
      <Button variant="destructive" onClick={() => setShowLogoutConfirm(true)}>
        Logout
      </Button>

      {/* Dialog */}
      <AlertDialog open={showLogoutConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout?</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Logout
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SettingsPage;