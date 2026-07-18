import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  BadgeDollarSign,
  CloudUpload,
  Heart,
  LayoutDashboard,
  LoaderCircle,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { StorageService } from "@/services/storageService";
import { toast } from "sonner";

const cardMotion = (index: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, delay: index * 0.05 },
});

export default function Settings() {
  const profile = useLocalStorage("profile");
  const [isLoading, setIsLoading] = useState(false);

  const handleExportData = async () => {
    setIsLoading(true);
    try {
      const data = StorageService.exportAllData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mindshift-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error("Failed to export data");
      console.error("Export error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all your data? This action cannot be undone.",
      )
    ) {
      StorageService.clearAllData();
      window.location.reload();
    }
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        "Are you sure you want to reset your progress? This will delete your check-in history, journal, and recovery progress, but keep your profile and assessment.",
      )
    ) {
      StorageService.clearProgressData();
      toast.success("Progress reset successfully!");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-heading font-semibold sm:text-3xl">
          Settings
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your MindShift AI experience and data
        </p>
      </div>

      {/* Profile Section */}
      <motion.div {...cardMotion(0)}>
        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20 text-primary flex-shrink-0">
                    <User className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {profile.habit === "custom" && profile.customHabitLabel
                        ? profile.customHabitLabel
                        : profile.habit
                          ? (window as any).HABITS?.[profile.habit]?.label ||
                            profile.habit
                          : "Not set"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Habit you're working on{" "}
                      {profile.habit === "custom" && profile.customHabitLabel
                        ? `(custom: ${profile.customHabitLabel})`
                        : ""}
                    </p>
                  </div>
                </div>

                <div className="border-t border-b py-3">
                  <p className="text-sm font-medium mb-2">
                    Assessment Completed
                  </p>
                  <p className="text-muted-foreground">
                    {profile.primaryTrigger ? "Yes" : "No"}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-muted-foreground">
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )
                      : "Not available"}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No profile found. Complete the assessment to get started.
              </p>
            )}
          </CardContent>
          <CardContent className="pt-4 border-t">
            {profile ? (
              <Button
                variant="outline"
                asChild
                className="w-full justify-center"
              >
                <Link to="/assessment">Update Assessment</Link>
              </Button>
            ) : (
              <Button asChild className="w-full justify-center">
                <Link to="/assessment">Start Assessment</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div {...cardMotion(1)}>
        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <CloudUpload
                    className="h-4 w-4 text-primary"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium">Export Data</p>
                    <p className="text-sm text-muted-foreground">
                      Download a JSON file with all your journal entries,
                      check-ins, and progress data
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleExportData}
                  aria-label="Export data"
                >
                  {isLoading ? (
                    <LoaderCircle className="size-4" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="size-4" aria-hidden="true" />
                  )}
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Reset Progress</p>
                <p className="text-sm text-muted-foreground">
                  Clear your check-in history, journal entries, and progress
                  tracking while keeping your profile
                </p>
                <Button
                  variant="destructive"
                  onClick={handleResetProgress}
                  className="w-full"
                >
                  Reset Progress
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Delete All Data</p>
                <p className="text-sm text-muted-foreground text-destructive">
                  Permanently delete all your data including profile,
                  assessment, and progress. This action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAllData}
                  className="w-full"
                >
                  Delete All Data
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div {...cardMotion(2)}>
        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className="h-4 w-4 text-success"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium">Privacy Mode</p>
                    <p className="text-sm text-muted-foreground">
                      All data stays on your device - never sent to servers
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  Always Enabled
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Heart className="h-4 w-4 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-md">Daily Reminders</p>
                    <p className="text-sm text-muted-foreground">
                      Get gentle nudges to check in and journal
                    </p>
                  </div>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => {
                      /* Would implement actual toggle */
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium">Enabled</span>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <BadgeDollarSign
                    className="h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-md">Premium Features</p>
                    <p className="text-sm text-muted-foreground">
                      Access advanced analytics and coaching
                    </p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  Coming Soon
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* About */}
      <motion.div {...cardMotion(3)}>
        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <LayoutDashboard
                  className="h-4 w-4 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium">Version</p>
                  <p className="text-sm text-muted-foreground">1.0.0</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BrainCircuit
                  className="h-4 w-4 text-primary"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-medium">App Name</p>
                  <p className="text-sm text-muted-foreground">MindShift AI</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Heart className="h-4 w-4 text-success" aria-hidden="true" />
                <div>
                  <p className="font-medium">Made With</p>
                  <p className="text-sm text-muted-foreground">
                    For anyone building better habits
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground">
                All data is stored locally on your device. We never collect or
                transmit your personal information.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
