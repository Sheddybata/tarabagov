"use client";

import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  Save,
  Eye,
  EyeOff,
  Settings,
  Database,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: "Admin User",
    email: "admin@tarabastate.gov.ng",
    phone: "0802 178 2214",
    role: "Administrator",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    reportAlerts: true,
    registrationAlerts: true,
    systemUpdates: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowPublicRegistration: true,
    autoApproveReports: false,
    sessionTimeout: "30",
  });

  const handleProfileUpdate = () => {
    // Simulate save
    window.alert("Profile updated successfully!");
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      window.alert("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      window.alert("Password must be at least 8 characters long!");
      return;
    }
    // Simulate save
    window.alert("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleNotificationSave = () => {
    window.alert("Notification settings saved!");
  };

  const handleSystemSave = () => {
    window.alert("System settings saved!");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account and system preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-taraba-green text-taraba-green"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Profile Information</h2>
            <p className="text-sm text-gray-600">
              Update your personal information and contact details
            </p>
          </div>

          <div className="space-y-6 max-w-2xl">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="fullName"
                  value={profileData.fullName}
                  onChange={(e) =>
                    setProfileData({ ...profileData, fullName: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative mt-1">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="pl-10"
                  placeholder="0802 178 2214"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <div className="relative mt-1">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="role"
                  value={profileData.role}
                  disabled
                  className="pl-10 bg-gray-50"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Role cannot be changed</p>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleProfileUpdate} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Change Password</h2>
            <p className="text-sm text-gray-600">
              Update your password to keep your account secure
            </p>
          </div>

          <div className="space-y-6 max-w-2xl">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handlePasswordChange} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Update Password
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Notification Preferences</h2>
            <p className="text-sm text-gray-600">
              Choose how you want to receive notifications
            </p>
          </div>

          <div className="space-y-6 max-w-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-taraba-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-taraba-green"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                  <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        smsNotifications: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-taraba-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-taraba-green"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Report Alerts</h3>
                  <p className="text-sm text-gray-600">Get notified when new reports are submitted</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.reportAlerts}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        reportAlerts: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-taraba-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-taraba-green"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Registration Alerts</h3>
                  <p className="text-sm text-gray-600">
                    Get notified when new registrations are submitted
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.registrationAlerts}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        registrationAlerts: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-taraba-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-taraba-green"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">System Updates</h3>
                  <p className="text-sm text-gray-600">Receive system maintenance and update notices</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notificationSettings.systemUpdates}
                    onChange={(e) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        systemUpdates: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-taraba-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-taraba-green"></div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleNotificationSave} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">System Configuration</h2>
              <p className="text-sm text-gray-600">Manage system-wide settings and preferences</p>
            </div>

            <div className="space-y-6 max-w-2xl">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Maintenance Mode</h3>
                  <p className="text-sm text-gray-600">
                    Enable maintenance mode to restrict public access
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.maintenanceMode}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        maintenanceMode: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-taraba-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-taraba-green"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Allow Public Registration</h3>
                  <p className="text-sm text-gray-600">
                    Allow citizens to register for services online
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.allowPublicRegistration}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        allowPublicRegistration: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-taraba-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-taraba-green"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Auto-Approve Reports</h3>
                  <p className="text-sm text-gray-600">
                    Automatically approve citizen reports without review
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={systemSettings.autoApproveReports}
                    onChange={(e) =>
                      setSystemSettings({
                        ...systemSettings,
                        autoApproveReports: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-taraba-green/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-taraba-green"></div>
                </label>
              </div>

              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Select
                  id="sessionTimeout"
                  value={systemSettings.sessionTimeout}
                  onChange={(e) =>
                    setSystemSettings({
                      ...systemSettings,
                      sessionTimeout: e.target.value,
                    })
                  }
                  className="mt-1"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                  <option value="240">4 hours</option>
                </Select>
              </div>

              <div className="pt-4 border-t">
                <Button onClick={handleSystemSave} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save System Settings
                </Button>
              </div>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">System Information</h2>
              <p className="text-sm text-gray-600">Current system status and version</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                <Database className="h-6 w-6 text-taraba-green" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Database</h3>
                  <p className="text-sm text-gray-600">Connected</p>
                  <p className="text-xs text-gray-500 mt-1">Supabase</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                <Globe className="h-6 w-6 text-taraba-green" />
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Environment</h3>
                  <p className="text-sm text-gray-600">Development</p>
                  <p className="text-xs text-gray-500 mt-1">Next.js 14.2.5</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
