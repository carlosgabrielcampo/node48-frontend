import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Globe,
  Workflow,
  Plus,
  Trash2,
  Circle,
  X
} from "lucide-react";
import { useEnv } from "@/contexts/EnvContext";
import { EnvProfile, EnvValues } from "@/types/env";
import { toast } from "sonner";
import { KeyValueInput } from "../layout/input";
import { DialogLayout } from "../layout/dialog";
import { TabLayout } from "../layout/tabs";
import { LabeledDropdown } from "../layout/dropdown";

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

  const [selectedEnvId, setSelectedEnvId] = useState<string | null>(null);
  const [globalEnvId, setGlobalEnvId] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<EnvProfile | null>(null);
  const [localValues, setLocalValues] = useState<EnvValues>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [maskedKeys, setMaskedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open && workflowId) {
      loadWorkflowEnvs(workflowId);      
    }
  }, [open, workflowId, loadWorkflowEnvs]);

  useEffect(() => {
    if (workflowEnvs?.activeEnvId) {
      setSelectedEnvId(workflowEnvs.activeEnvId);
    }
  }, [workflowEnvs, activeProjectEnvId]);

  useEffect(() => {
    if (editingProfile) {
      setLocalValues({ ...editingProfile.values });
      setMaskedKeys(new Set(Object.keys(editingProfile.values)));
      setIsDirty(false);
    }
  }, [editingProfile]);

  const handleValuesChange = useCallback((_bind: string, newValues: EnvValues) => {
    setLocalValues(newValues);
    setIsDirty(true);
  }, []);

  const handleEnvSwitch = useCallback((envId: string | null) => {
    if (isDirty) {
      setPendingAction(() => () => {
        setSelectedEnvId(envId);
        setWorkflowActiveEnv(workflowId, envId);
        setIsDirty(false);
      });
      setShowConfirmDiscard(true);
    } else {
      setSelectedEnvId(envId);
      setWorkflowActiveEnv(workflowId, envId);
    }
  }, [isDirty, workflowId, setWorkflowActiveEnv]);

  const handleGlobalEnvSwitch = useCallback(({ value }: { value: string }) => {
    if (isDirty) {
      setPendingAction(() => () => {
        setGlobalEnvId(value);
        setGlobalActiveEnv(workflowId, value);
        setIsDirty(false);
      });
      setShowConfirmDiscard(true);
    } else {
      setGlobalEnvId(value);
      setGlobalActiveEnv(workflowId, value);
    }
  }, [isDirty, workflowId, setGlobalActiveEnv]);

  const handleClose = useCallback(() => {
    if (isDirty) {
      setPendingAction(() => () => onOpenChange(false));
      setShowConfirmDiscard(true);
    } else {
      onOpenChange(false);
    }
  }, [isDirty, onOpenChange]);

  const handleSave = async () => {
    if (!editingProfile || !workflowId) return;
    try {
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

  const handleCreateProfile = async () => {
    if (!newProfileName.trim() || !workflowId) return;
    try {
      await createWorkflowEnv(workflowId, {
        name: newProfileName.trim(),
        values: {},
      } as any);
      setNewProfileName("");
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

  const handleSetActive = async (id: string) => {
    if (!workflowId) return;
    try {
      await setGlobalActiveEnv(id, selectedEnvId);
      toast.success("Active environment updated");
    } catch (error) {
      toast.error("Failed to set active environment");
    }
  };

  const activeGlobalEnv = activeGlobalEnvId && globalEnvs.profiles ? globalEnvs.profiles[activeGlobalEnvId] : null;
  const workflowProfiles = workflowEnvs?.envProfiles || [];
  const selectedProfile = selectedEnvId && workflowEnvs?.envProfiles 
    ? workflowEnvs.envProfiles.find(p => p.id === selectedEnvId) 
    : null;

  const WorkflowLabeledCard = ({ label, profile, envId }: { label: string; profile: EnvProfile | null; envId: string }) => (
    <div className="space-y-2">
      <Label className="text-muted-foreground">{label}</Label>
      <div className="flex items-center p-3 rounded-lg bg-muted/50">
        <div className="w-full">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4" />
            <span className="font-medium">{profile?.name || "None"}</span>
            {profile?.isDefault && <Badge variant="secondary">Default</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">
            {Object.keys(profile?.values || {}).length} variables defined
          </p>  
        </div>
        {profile && (
          <Button variant="outline" onClick={() => removeWorkflowActiveEnv(envId, profile.id)}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  const dropdownOptions = globalEnvs.profiles 
    ? Object.values(globalEnvs.profiles).map((env) => ({ 
        itemProperties: { value: env.id }, 
        itemDisplay: env.name + (env.isDefault ? " (Default)" : "")
      }))
    : [];

  return (
    <DialogLayout 
      open={open} 
      handleClose={handleClose} 
      classes={{contentClass: "max-w-4xl max-h-[85vh] flex flex-col"}}
      dialogTitle={
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5" />
          Workflow Environment Configuration
        </div>
      }
      dialogDescription="Configure environment variables for this workflow. Workflow overrides take precedence over project defaults."
      dialogFooter={
        <>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveAndClose} disabled={!isDirty}>Save & Close</Button>
        </>
      }
    >
      <TabLayout 
        tabs={[
          {
            value: "active",
            trigger: "Active Environment",
            class: "flex-1 space-y-4 mt-4",
            content: (
              <div className="space-y-4 h-full">
                <div className="space-y-2">
                  <LabeledDropdown 
                    label="Select Active Global Environment"
                    onSelect={handleGlobalEnvSwitch}
                    header={<span>{activeGlobalEnv?.name || "Select environment..."}</span>}
                    options={dropdownOptions}
                  />
                </div>
                {selectedEnvId !== workflowEnvs?.activeEnvId && (
                  <Button onClick={() => handleSetActive(workflowId)} className="w-full">
                    Set as Active for Workflow
                  </Button>
                )}
                <WorkflowLabeledCard 
                  label="Current Global Environment" 
                  profile={activeGlobalEnv}
                  envId="global"
                />
                <WorkflowLabeledCard 
                  label="Current Workflow Profile" 
                  profile={selectedProfile}
                  envId={workflowId}
                />                  
              </div>
            )
          },
          {
            value: "profiles",
            trigger: "Workflow Profiles",
            class: "flex-1 flex flex-col min-h-full mt-4",
            content: (
              <>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="New profile name..."
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateProfile()}
                  />
                  <Button onClick={handleCreateProfile} disabled={!newProfileName.trim()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                  </Button>
                </div>
                {workflowProfiles.length === 0 ? (
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
                  <div className="flex gap-4 flex-1 min-h-full">
                    <div className="w-48 space-y-2">
                      <Label className="text-xs text-muted-foreground">Profiles</Label>
                      <ScrollArea className="h-full overflow-hidden">
                        <div className="space-y-1 pr-2">
                          {workflowProfiles.map((profile) => (
                            <div
                              key={profile.id}
                              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                                editingProfile?.id === profile.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"
                              }`}
                              onClick={() => setEditingProfile(profile)}
                            >
                              <span className="text-sm truncate">{profile.name}</span>
                              <div className="flex gap-1 items-center justify-center h-6">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEnvSwitch(selectedEnvId === profile.id ? null : profile.id);
                                  }}
                                >
                                  {selectedEnvId === profile.id
                                    ? <Circle className="bg-green-500 rounded-full text-green-500 h-3 w-3" />
                                    : <Circle className="border-green-500 text-green-500 rounded-full h-3 w-3" />
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
                                  <Trash2 className="text-destructive h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                    <div className="flex-1 border rounded-lg p-4 min-h-full">
                      {editingProfile ? (
                        <div className="h-full flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium">{editingProfile.name}</h4>
                              <p className="text-xs text-muted-foreground">
                                {Object.keys(localValues).length} variables
                                {isDirty && <Badge variant="destructive" className="ml-2">Unsaved</Badge>}
                              </p>
                            </div>
                            <Button onClick={handleSave} disabled={!isDirty} size="sm">
                              Save
                            </Button>
                          </div>
                          <KeyValueInput 
                            bind="values" 
                            value={localValues} 
                            commit={handleValuesChange}
                            type="masked"
                          />
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          Select a profile to edit
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )
          },
        ]}
      />
    </DialogLayout>
  );
};
