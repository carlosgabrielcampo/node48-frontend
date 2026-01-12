import { useTheme } from "@/contexts/ThemeContext";
import { useEnv } from "@/contexts/EnvContext";
import { useWorkflowEditor } from "@/contexts/WorkflowEditorContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Monitor, Plus, Download, Upload, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { KeyValueInput } from "@/components/layout/input";
import { EnvProfile } from "@/types/env";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const { createProjectEnv, updateProjectEnv, deleteProjectProfile, setProjectDefault, exportEnvs, importEnvs, globalEnvs } = useEnv();
  const { autosaveEnabled, setAutosaveEnabled } = useWorkflowEditor();
  
  const [newEnvName, setNewEnvName] = useState("");
  const [newEnvDialogOpen, setNewEnvDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateEnv = async (id: string) => {
    if (!newEnvName.trim()) return;
    const profileObj = {values: {}}
    if(!Object.values(globalEnvs.profiles).length) profileObj.isDefault = true
    await createProjectEnv({id, profiles: {[newEnvName.trim()]: profileObj}, active: [] });
    setNewEnvName("");
    setNewEnvDialogOpen(false);
  };

  const handleExport = async () => {
    const json = await exportEnvs();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "environments.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Environments exported");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      await importEnvs(text);
    } catch {
      toast.error("Invalid JSON file");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleValuesUpdate = async (envId, values: Record<string, string>) => {
    await updateProjectEnv("global", envId, values);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-4xl py-8 px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your application preferences</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how the application looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Theme Mode</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant={theme === "dark" ? "default" : "outline"} className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => setTheme("dark")}>
                      <Moon className="h-5 w-5" /><span className="text-sm">Dark</span>
                    </Button>
                    <Button variant={theme === "light" ? "default" : "outline"} className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => setTheme("light")}>
                      <Sun className="h-5 w-5" /><span className="text-sm">Light</span>
                    </Button>
                    <Button variant={theme === "system" ? "default" : "outline"} className="flex flex-col items-center gap-2 h-auto py-4" onClick={() => setTheme("system")}>
                      <Monitor className="h-5 w-5" /><span className="text-sm">System</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Environment Profiles</CardTitle>
                  <CardDescription>Manage project-level environment variables</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4 mr-1" />Export</Button>
                  <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4 mr-1" />Import</Button>
                  <input type="file" ref={fileInputRef} accept=".json" className="hidden" onChange={handleImport} />
                  <Dialog open={newEnvDialogOpen} onOpenChange={setNewEnvDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        New
                      </Button>
                    </DialogTrigger>
                    
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Create Environment
                        </DialogTitle>
                      </DialogHeader>
                      <div className="py-4">
                        <Label>Name</Label>
                        <Input value={newEnvName} onChange={(e) => setNewEnvName(e.target.value)} placeholder="e.g., Production" className="mt-1" />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setNewEnvDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => handleCreateEnv('global')} disabled={!newEnvName.trim()}>Create</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                { globalEnvs?.profiles && Object.entries(globalEnvs.profiles)?.map(([env, profile], i) => 
                  <Card key={env} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{env}</span>
                        {profile.isDefault && <Badge>Default</Badge>}
                      </div>
                      <div className="flex gap-2">
                        {!profile.isDefault && <Button variant="outline" size="sm" onClick={() => setProjectDefault("global", env)}><Star className="h-4 w-4" /></Button>}
                        <Button variant="destructive" size="sm" onClick={() => deleteProjectProfile("global", env)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                      <KeyValueInput bind="" value={profile.values} commit={(bind, values) => handleValuesUpdate(env, values)} type="masked" /> 
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Workflow Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow Preferences</CardTitle>
                <CardDescription>Default settings for workflow editor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Auto-save</Label>
                    <p className="text-xs text-muted-foreground">Automatically save changes after 2 seconds of inactivity</p>
                  </div>
                  <Switch checked={autosaveEnabled} onCheckedChange={setAutosaveEnabled} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
