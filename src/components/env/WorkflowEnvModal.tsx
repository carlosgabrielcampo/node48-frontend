import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  Globe,
  Workflow,
  Plus,
  Trash2,
  AlertTriangle,
  Circle
} from "lucide-react";
import { useEnv } from "@/contexts/EnvContext";
import { EnvProfile, EnvValues } from "@/types/env";
import { toast } from "sonner";
import { KeyValueInput } from "../layout/input";

interface WorkflowEnvModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string;
}

export const WorkflowEnvModal = ({
  open,
  onOpenChange,
  workflowId,
}: WorkflowEnvModalProps) => {
  const {
    getEnvDiff,
    globalEnvs,
    workflowEnvs,
    loadWorkflowEnvs,
    createWorkflowEnv,
    updateWorkflowEnv,
    deleteWorkflowEnv,
    activeGlobalEnvId,
    setGlobalActiveEnv,
    activeProjectEnvId,
    setWorkflowActiveEnv,
    removeWorkflowActiveEnv,
  } = useEnv();

  // Local state for editing
  const [selectedEnvId, setSelectedEnvId] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<EnvProfile | null>(null);
  const [localValues, setLocalValues] = useState<EnvValues>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [maskedKeys, setMaskedKeys] = useState<Set<string>>(new Set());

  // Load workflow envs on mount
  useEffect(() => {
    if (open && workflowId) {
      loadWorkflowEnvs(workflowId);
    }
  }, [open, workflowId, loadWorkflowEnvs]);

  // Initialize selected env
  useEffect(() => {
    if (workflowEnvs) {
      setSelectedEnvId(workflowEnvs.activeEnvId || activeProjectEnvId || null);
    }
  }, [workflowEnvs, activeProjectEnvId]);

  // Reset when profile changes
  useEffect(() => {
    if (editingProfile) {
      setLocalValues({ ...editingProfile.values });
      setMaskedKeys(new Set(Object.keys(editingProfile.values)));
      setIsDirty(false);
    }
  }, [editingProfile]);

  const handleValuesChange = useCallback((_bind, newValues: EnvValues) => {
    console.log(newValues)
    setLocalValues(newValues);
    setIsDirty(true);
  }, []);

  const handleEnvSwitch = useCallback((envId: string) => {
    if (isDirty) {
      setPendingAction(() => () => {
        setSelectedEnvId(envId);
        setIsDirty(false);
      });
      setShowConfirmDiscard(true);
    } else {
      setSelectedEnvId(envId);
    }
  }, [isDirty]);

  const handleClose = useCallback(() => {
    if (isDirty) {
      setPendingAction(() => () => onOpenChange(false));
      setShowConfirmDiscard(true);
    } else {
      onOpenChange(false);
    }
  }, [isDirty, onOpenChange]);

  const handleSave = async () => {
    console.log({editingProfile})
    if (!editingProfile || !workflowId) return;
    try {
      console.log({workflowId, editingProfile, localValues})
      await updateWorkflowEnv(workflowId, editingProfile.id, {
        values: localValues,
      });
      setIsDirty(false);
      toast.success("Environment saved");
    } catch (error) {
      toast.error("Failed to save environment");
    }
  };

  const handleSaveAndClose = async () => {
    await handleSave();
    onOpenChange(false);
  };

  const handleDiscard = () => {
    if (editingProfile) {
      setLocalValues({ ...editingProfile.values });
    }
    setIsDirty(false);
    setShowConfirmDiscard(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleSaveFromConfirm = async () => {
    await handleSave();
    setShowConfirmDiscard(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleCreateProfile = async () => {
    if (!newProfileName.trim() || !workflowId) return;
    try {
      const newEnv = await createWorkflowEnv(workflowId, {
        id: newProfileName.trim(),
        name: newProfileName.trim(),
        values: {},
        scope: "workflow"
      });

      setNewProfileName("");
      // setEditingProfile(newEnv);
      toast.success("Environment profile created");
    } catch (error) {
      toast.error("Failed to create profile");
    }
  };

  const handleDeleteProfile = async (envId: string) => {
    if (!workflowId) return;
    try {
      await deleteWorkflowEnv(workflowId, envId);
      if (editingProfile?.id === envId) {
        setEditingProfile(null);
      }
      toast.success("Environment profile deleted");
    } catch (error) {
      toast.error("Failed to delete profile");
    }
  };

  const handleSetActive = async (id) => {
    if (!workflowId) return;
    try {
      await setGlobalActiveEnv(id, selectedEnvId);
      toast.success("Active environment updated");
    } catch (error) {
      toast.error("Failed to set active environment");
    }
  };

  // Find environments
  // console.log("workflowEnvs.profiles", {active: workflowEnvs.active, workflowEnvs, activeGlobalEnvId})
  const activeGlobalEnv = workflowEnvs.active ? workflowEnvs.active.find((e) => e.id === activeGlobalEnvId) : []
  const workflowProfiles = workflowEnvs?.envProfiles || [];

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Workflow Environment Configuration
            </DialogTitle>
            <DialogDescription>
              Configure environment variables for this workflow. Workflow overrides take precedence over project defaults.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="active" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active">Active Environment</TabsTrigger>
              <TabsTrigger value="profiles">Workflow Profiles</TabsTrigger>
            </TabsList>

            {/* Active Environment Tab */}
            <TabsContent value="active" className="flex-1 space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Active Global Environment</Label>
                  <Select value={selectedEnvId || ""} onValueChange={handleEnvSwitch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment..." />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        Project Environments
                      </div>
                      { globalEnvs.profiles && Object.values(globalEnvs?.profiles).map((env) => (
                        <SelectItem key={env.id} value={env.id} onClick={() => setWorkflowActiveEnv(workflowId, env.id)}>
                          <span className="flex items-center gap-2">
                            <Globe className="h-3 w-3" />
                            {env.name}
                            {env.isDefault && (
                              <Badge variant="outline" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </span>
                        </SelectItem>
                      ))}
                      
                      {workflowProfiles.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-2">
                            Workflow Overrides
                          </div>
                          {workflowProfiles.map((env) => (
                            <SelectItem key={env.id} value={env.id}>
                              <span className="flex items-center gap-2">
                                <Workflow className="h-3 w-3" />
                                {env.name}
                              </span>
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEnvId !== workflowEnvs?.activeEnvId && (
                  <Button onClick={() => handleSetActive(workflowId)} className="w-full">
                    Set as Active for Workflow
                  </Button>
                )}

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Current Global Environment</Label>
                  <div className="flex items-center p-3 rounded-lg bg-muted/50">
                    <div className=" w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-4 w-4" />
                        <span className="font-medium">{activeGlobalEnv?.name || "None"}</span>
                        { activeGlobalEnv?.isDefault && ( <Badge variant="secondary">Default</Badge> )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Object.keys(activeGlobalEnv?.values || {}).length} variables defined
                      </p>  
                    </div>
                    {
                      activeGlobalEnv 
                      ? <Button variant="outline" onClick={() => removeWorkflowActiveEnv(workflowId, activeGlobalEnv.id)}>
                          <Trash2 />
                        </Button>
                      : <></>
                    }

                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Current Workflow Profile</Label>
                  <div className="flex items-center p-3 rounded-lg bg-muted/50">
                    <div className="w-full">
                      {console.log({selectedEnvId, activeProjectEnvId, activeGlobalEnv})}
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-4 w-4" />
                        <span className="font-medium">{selectedEnvId?.name || "None"}</span>
                        { selectedEnvId?.isDefault && ( <Badge variant="secondary">Default</Badge> )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {Object.keys(selectedEnvId?.values || {}).length} variables defined
                      </p>  
                    </div>
                    {
                      selectedEnvId 
                      ? <Button variant="outline" onClick={() => setWorkflowActiveEnv("")}>
                          <Trash2 />
                        </Button>
                      : <></>
                    }
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profiles" className="flex-1 flex flex-col min-h-0 mt-4">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="New profile name..."
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateProfile()}
                />
                <Button onClick={() => handleCreateProfile()} disabled={!newProfileName.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </div>
              {workflowEnvs.profiles && Object.values(workflowEnvs.profiles).length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div className="space-y-2">
                    <Workflow className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <p className="text-muted-foreground">No workflow-specific profiles</p>
                    <p className="text-sm text-muted-foreground">
                      Create a profile to override project environment values
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 flex-1 min-h-0">
                  {/* Profile List */}
                  <div className="w-48 space-y-2">
                    <Label className="text-xs text-muted-foreground">Profiles</Label>
                    <ScrollArea className="h-full overflow-hidden">
                      <div className="space-y-1 pr-2">
                        {workflowEnvs.profiles && Object.values(workflowEnvs.profiles).map((profile) => (
                          <div
                          key={profile.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                            editingProfile?.id === profile.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted" }`}
                            onClick={() => setEditingProfile(profile)}
                          >
                            <span className="text-sm truncate">{profile.name}</span>
                              <div className="flex gap-1 items-center justify-center h-6">
                                <div className="flex h-full items-center">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedEnvId(profile)
                                    }}
                                  >
                                    {
                                      selectedEnvId?.id === profile?.id 
                                      ? <Circle className="bg-success rounded-full text-success" />
                                      : <Circle className="border-success text-success rounded-full" />
                                    }
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteProfile(profile.id);
                                    }}
                                    >
                                    <div className="flex h-full items-center">
                                      <Trash2 className="text-destructive" />
                                    </div>
                                  </Button>
                                </div>
                              </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Profile Editor */}
                  <div className="flex-1 border rounded-lg p-4 min-h-0">
                    {editingProfile ? (
                      <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium">{editingProfile.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {Object.keys(localValues).length} variables
                              { isDirty && (<Badge variant="destructive" className="ml-2">Unsaved</Badge>) }
                            </p>
                          </div>
                          <Button size="sm" onClick={handleSave} disabled={!isDirty}>Save Changes</Button>
                        </div>
                        <ScrollArea className="flex-1 gap-2 ">
                          <KeyValueInput value={localValues} bind={""} commit={handleValuesChange} type={"masked"}/>
                        </ScrollArea>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        Select a profile to edit
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveAndClose} disabled={!isDirty}>
              Save & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Confirmation */}
      <AlertDialog open={showConfirmDiscard} onOpenChange={setShowConfirmDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes to the environment profile. What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingAction(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDiscard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard Changes
            </AlertDialogAction>
            <AlertDialogAction onClick={handleSaveFromConfirm}>
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
