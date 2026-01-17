import { useCallback, useState } from "react";
import { Input } from "../ui/input"
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Workflow, Star, Trash2, Plus, Badge } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { KeyValueInput } from "../layout/input";
import { v4 as uuid } from "uuid";
import { Label } from "../ui/label";
import { useEnv } from "@/contexts/EnvContext";
import { EnvProfile } from "@/types/env";

interface ProfileInterface {
    active: { activeLocal: EnvProfile };
    isDirty: boolean;
    handleSave: () => Promise<void>;
    workflowId: string;
    setIsDirty: React.ReactEventHandler;
    localValues: string;
    editingProfile: string;
    handleEnvSwitch: (envId: string | null, type: "workflow" | "global") => Promise<void>;
    setEditingProfile: React.ReactEventHandler;
}

export const ProfileTab = ({
    workflowId,
    activeLocal,
    handleEnvSwitch,
    updateActiveEnvs,
}: ProfileInterface): React.ReactElement => {
    const {
        allEnvs,
        updateProjectEnv,
        loadWorkflowEnvs,
        createProjectEnv,
        deleteWorkflowEnv,
    } = useEnv();
    const [isDirty, setIsDirty] = useState(false);
    const [newProfileName, setNewProfileName] = useState("");
    const [editingProfile, setEditingProfile] = useState<Partial<EnvProfile>>({});
    const workflowProfiles = allEnvs?.[workflowId]?.profiles;
    console.log(allEnvs?.[workflowId]?.profiles)
    const handleSave = async () => {
        if (!editingProfile || !workflowId) return;
        try {
            await updateProjectEnv(workflowId, editingProfile.id, { ...editingProfile })
            loadWorkflowEnvs(workflowId);
            setIsDirty(false);
            updateActiveEnvs()
        } catch (error) {
            toast.error("Failed to save environment");
        }
    };

    const handleValuesChange = useCallback((_bind: string, newValues: EnvValues) => {
        setEditingProfile({ ...editingProfile, values: newValues });
        setIsDirty(true)
    }, [editingProfile]);

    const handleCreateProfile = async () => {
        if (!newProfileName.trim() || !workflowId) return;
        try {
            const profileName = newProfileName.trim()
            await createProjectEnv({ "id": workflowId, profileName });
            setNewProfileName("");
            loadWorkflowEnvs(workflowId);
        } catch (error) {
            toast.error("Failed to create profile");
        }
    };

    const handleDeleteProfile = async (envId: string) => {
        if (!workflowId) return;
        try {
            await deleteWorkflowEnv(workflowId, envId);
            toast.success("Environment profile deleted");
        } catch (error) {
            console.log(error)
            toast.error("Failed to delete profile");
        }
    };

    const SelectorItem = ({profileItem}) => <div
            key={profileItem.id}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${editingProfile.id === profileItem.id ?  'bg-primary/10  border-primary/30' : '' } border`}
            onClick={() => setEditingProfile({ ...profileItem })}
        >
        <span className="text-sm truncate">{profileItem.name}</span>
        <div className="flex items-center justify-end h-6">
            <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6"
                onClick={(e) => {e.stopPropagation(); handleEnvSwitch(profileItem.id, "workflow")}}
            >
                {
                    activeLocal.id === profileItem?.id
                        ? <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-primary text-primary-text-color mr-8`}>
                            Active
                        </span>
                        : <Star className="h-3 w-3" />
                }
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => { e.stopPropagation(); handleDeleteProfile(profileItem.id); }}
            >
                <Trash2 className="text-destructive h-4 w-4" />
            </Button>
        </div>
    </div>

    const profileSelector = () => workflowProfiles && Object.values(workflowProfiles).map((profileItem: EnvProfile) => <SelectorItem profileItem={profileItem} />)
    console.log({workflowProfiles})
    return (
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
            {
                workflowProfiles && Object.values(workflowProfiles).length === 0 ? (
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
                    <div className="flex gap-4 flex-1 h-full ">
                        <div className="w-48 space-y-2">
                            <Label className="text-xs text-muted-foreground">Profiles</Label>
                            <ScrollArea className="h-full overflow-hidden">
                                <div className="space-y-1 pr-2">{
                                profileSelector({ workflows: workflowProfiles, setEditingProfile })}</div>
                            </ScrollArea>
                        </div>
                        <div className="flex-1 border rounded-lg p-4 min-h-full">
                            {
                                editingProfile.id
                                    ? (
                                        <div className="h-full flex flex-col">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h4 className="font-medium">{editingProfile.name}</h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {editingProfile?.values && Object.keys(editingProfile.values).length} variables
                                                    </p>
                                                </div>
                                                <Button onClick={handleSave} disabled={!isDirty} size="sm">
                                                    Save
                                                </Button>
                                            </div>
                                            <KeyValueInput
                                                bind="values"
                                                value={editingProfile.values}
                                                commit={handleValuesChange}
                                                type="masked"
                                            />
                                        </div>
                                    )
                                    : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground">
                                            Select a profile to edit
                                        </div>
                                    )
                            }
                        </div>
                    </div>
                )}
        </>
    )
}