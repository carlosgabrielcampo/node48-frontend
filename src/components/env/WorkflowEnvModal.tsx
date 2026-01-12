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
import { v4 as uuid } from "uuid";

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
    getActiveEnvs,
    loadWorkflowEnvs,
    createProjectEnv,
    updateProjectEnv,
    deleteWorkflowEnv,
    activeProjectEnvId,
    setWorkflowActiveEnv,
    removeWorkflowActiveEnv,
  } = useEnv();

  const [activeGlobal, setActiveGlobal] = useState({})
  const [activeLocal, setActiveLocal] = useState({})

  const [editingProfile, setEditingProfile] = useState<EnvProfile | null>(null);
  const [localValues, setLocalValues] = useState<EnvValues>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [maskedKeys, setMaskedKeys] = useState<Set<string>>(new Set());
  
  const getActiveEnv = async( ) =>{
    const activeArray = await getActiveEnvs({id: workflowId})
    if(activeArray?.length){
      activeArray.map((e) => e.scope === "global" ? setActiveGlobal({...e}) : setActiveLocal({...e}) )
    }
    loadWorkflowEnvs(workflowId)
  }

  useEffect(() => {
    if (open && workflowId) loadWorkflowEnvs(workflowId);      
  }, [open, workflowId, loadWorkflowEnvs]);

  useEffect(() => {getActiveEnv()}, []);

  useEffect(() => {
    if (editingProfile) {
      setLocalValues({ ...editingProfile.values });
      setMaskedKeys(new Set(Object.keys(editingProfile.values)));
      setIsDirty(false);
    }
  }, [editingProfile?.id]);

  const handleValuesChange = useCallback((_bind: string, newValues: EnvValues) => {
    setLocalValues(newValues);
    setIsDirty(true);
  }, []);

  const handleEnvSwitch = useCallback(async (envId: string | null, type: "workflow" | "global") => {
    if (isDirty) {
      setPendingAction(() => async () => {
        const activeEnv = await setWorkflowActiveEnv(workflowId, envId, type);
        if(type === "global") setActiveGlobal({...activeEnv})
        else setActiveLocal({...activeEnv}) 
        setIsDirty(false);
      });
      setShowConfirmDiscard(true);
    } else {
      const activeEnv = await setWorkflowActiveEnv(workflowId, envId, type);
      if(type === "global") setActiveGlobal({...activeEnv})
      else setActiveLocal({...activeEnv}) 
    }
  }, [isDirty, workflowId, setWorkflowActiveEnv]);

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
      await updateProjectEnv(workflowId, editingProfile.name, {...editingProfile, values: localValues})
      loadWorkflowEnvs(workflowId); 
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

  // const handleDiscard = () => {
  //   if (editingProfile) {
  //     setLocalValues({ ...editingProfile.values });
  //   }
  //   setIsDirty(false);
  //   setShowConfirmDiscard(false);
  //   if (pendingAction) {
  //     pendingAction();
  //     setPendingAction(null);
  //   }
  // };

  const handleCreateProfile = async () => {
    if (!newProfileName.trim() || !workflowId) return;
    try {
      const profileName = newProfileName.trim()
      const profileObj = {values: {}, id: uuid(), name: profileName}
      if(!Object.values(globalEnvs.profiles).length) profileObj.isDefault = true
      await createProjectEnv({id: workflowId, profiles: {[profileName]: profileObj} });
      setNewProfileName("");
      loadWorkflowEnvs(workflowId); 
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

  const workflowProfiles = workflowEnvs?.profiles || {};
  // const selectedProfile = selectedEnvId && workflowEnvs?.envProfiles 
  //   ? workflowEnvs.envProfiles.find(p => p.id === selectedEnvId) 
  //   : null;

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
          <Button variant="outline" onClick={() => removeWorkflowActiveEnv(envId, profile.name)}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  console.log({activeGlobal})
  const dropdownOptions = globalEnvs.profiles 
    ? Object.entries(globalEnvs.profiles).map(([name, env]) => ({ 
        itemProperties: { value: env.name }, 
        display: name + (env.isDefault ? " (Default)" : "")
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
                    label="Select Global Environment"
                    onSelect={(e) => handleEnvSwitch(e.value, "global")}
                    header={<span className="text-sm">{ "Select environment..."}</span>}
                    options={dropdownOptions}
                  />
                </div>
                <WorkflowLabeledCard 
                  label="Current Global Environment" 
                  profile={activeGlobal}
                  envId="global"
                />
                <WorkflowLabeledCard 
                  label="Current Workflow Profile" 
                  profile={activeLocal}
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
                {Object.values(workflowProfiles).length === 0 ? (
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
                          {Object.values(workflowProfiles).map((profile) => (
                            <div
                              key={profile.id}
                              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                                editingProfile?.id === profile.id ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"
                              }`}
                              
                              onClick={() => {
                                setLocalValues(profile.values)
                                setEditingProfile(profile)
                              }}
                            >
                              <span className="text-sm truncate">{profile.name}</span>
                              <div className="flex gap-1 items-center justify-center h-6">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEnvSwitch(activeLocal.name === profile.name ? null : profile.name, "workflow");
                                  }}
                                >
                                  {activeLocal.name === profile.name
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
