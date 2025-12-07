import { useTheme } from "@/contexts/ThemeContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkflowSidebar } from "@/components/workflow/WorkflowSidebar";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
      <div className="flex min-h-screen w-full bg-background">
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl py-8 px-6">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">Manage your application preferences</p>
            </div>

            <div className="space-y-6">
              {/* Appearance Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>
                    Customize how the application looks and feels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold mb-3 block">Theme Mode</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        className="flex flex-col items-center gap-2 h-auto py-4"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-5 w-5" />
                        <span className="text-sm">Dark</span>
                      </Button>
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        className="flex flex-col items-center gap-2 h-auto py-4"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-5 w-5" />
                        <span className="text-sm">Light</span>
                      </Button>
                      <Button
                        variant={theme === "system" ? "default" : "outline"}
                        className="flex flex-col items-center gap-2 h-auto py-4"
                        onClick={() => setTheme("system")}
                      >
                        <Monitor className="h-5 w-5" />
                        <span className="text-sm">System</span>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      {theme === "system"
                        ? "Follows your system preferences"
                        : `Currently using ${theme} mode`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* General Section - Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>General</CardTitle>
                  <CardDescription>General application settings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Language</Label>
                      <Button variant="outline" className="w-full justify-start" disabled>
                        English (US)
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        Coming soon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Workflow Preferences - Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>Workflow Preferences</CardTitle>
                  <CardDescription>
                    Default settings for workflow editor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Auto-save
                      </Label>
                      <Button variant="outline" disabled>
                        Enabled
                      </Button>
                      <p className="text-xs text-muted-foreground mt-1">
                        Coming soon
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
  );
}
