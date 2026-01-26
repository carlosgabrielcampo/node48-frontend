import { useCallback, useRef, useState } from "react";
import { Input } from "../ui/input"
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Workflow, Trash2, Plus, CirclePower, Upload, Download, SquarePen, X, Save, Check } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { KeyValueInput } from "../layout/input";
import { Label } from "../ui/label";
import { useEnv } from "@/contexts/EnvContext";
import { EnvProfile } from "@/types/env";
import { useWorkflowEditor } from "@/contexts/WorkflowEditorContext";

interface ProfileInterface {
    active: { activeLocal: EnvProfile };
    isDirty: boolean;
    handleSave: () => Promise<void>;
    workflowId: string;
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
        importEnvs,
        exportEnvs,
        updateProjectEnv,
        loadWorkflowEnvs,
        createProjectEnv,
        deleteWorkflowEnv,
    } = useEnv();
    const { setDirty, isDirty } = useWorkflowEditor()
    const [newProfileName, setNewProfileName] = useState("");
    const [profileName, setProfileName] = useState("");
    const [editingProfile, setEditingProfile] = useState<Partial<EnvProfile>>({});
    const workflowProfiles = allEnvs?.[workflowId]?.profiles;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = async () => {
        const json = await exportEnvs({id: workflowId});
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
            await importEnvs(text, workflowId);
        } catch {
            toast.error("Invalid JSON file");
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };
    
    const handleSave = async () => {
        if (!editingProfile || !workflowId) return;
        try {
            await updateProjectEnv(workflowId, editingProfile.id, { ...editingProfile })
            loadWorkflowEnvs(workflowId);
            setDirty(false);
            updateActiveEnvs()
        } catch (error) {
            toast.error("Failed to save environment");
        }
    };

    const handleValuesChange = useCallback((_bind: string, newValues: EnvValues) => {
        setEditingProfile({ ...editingProfile, values: newValues });
        setDirty(true)
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
            toast.error("Failed to delete profile");
        }
    };

    const SelectorItem = ({profileItem}) => <div
            key={profileItem.id}
            className={`flex items-center my-2 w-48 justify-between p-2 rounded-md cursor-pointer transition-colors ${editingProfile.id === profileItem.id ?  'bg-primary/10  border-primary/30' : '' } border`}
            onClick={() => {
                setEditingProfile({ ...profileItem })
                setDirty(false)
            }}
        >
        <span className="text-sm truncate overflow-x-hidden w-24">{profileItem.name}</span>
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
                        : <CirclePower className="h-3 w-3" />
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
    return (
        <>
            <div className="flex gap-2 mb-4">
                <input type="file" ref={fileInputRef} accept=".json" className="hidden" onChange={handleImport} />
                <Input
                    placeholder="New profile name..."
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateProfile()}
                />
                <Button onClick={handleCreateProfile} disabled={!newProfileName.trim()}>
                    <Plus className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}><Download className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /></Button>
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
                        <ScrollArea className="max-h-[45vh]">
                            <Label className="text-xs text-muted-foreground">Profiles</Label>
                            {profileSelector({ workflows: workflowProfiles, setEditingProfile })}
                        </ScrollArea>
                        <div className="flex-1 rounded-lg p-4 min-h-full">
                            {
                                editingProfile.id
                                    ? (
                                        <div className="h-full flex flex-col">
                                            <div className="flex items-center justify-between mb-4">
                                                <div> 
                                                    {
                                                        profileName
                                                        ?<div className="flex items-center gap-3 ml-1">
                                                            <Input
                                                                className="font-bold w-auto"
                                                                value={profileName}
                                                                onChange={(e) => setProfileName(e.target.value)}
                                                            />
                                                            <Button 
                                                                variant={profileName !== editingProfile.name ? "default" : "outline"} 
                                                                size="sm" 
                                                                onClick={() => {
                                                                    setProfileName("")
                                                                    setEditingProfile({...editingProfile, name: profileName})
                                                                    setDirty(true)
                                                                }}
                                                            >
                                                                <Check className="cursor-pointer" />
                                                            </Button>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={() => setProfileName("")}
                                                            >
                                                                <X className="cursor-pointer" />
                                                            </Button>
                                                        </div>
                                                        :<div className="flex items-center gap-3 ml-1">
                                                            <h4 className="text-sm font-bold px-3 py-2"onDoubleClick={() => setProfileName(editingProfile.name)}>{editingProfile.name}</h4>
                                                            <Button variant="outline" size="sm" onClick={() => setProfileName(editingProfile.name)}>
                                                                <SquarePen className="cursor-pointer" />
                                                            </Button>
                                                        </div>
                                                    }
                                                </div>
                                                <Button onClick={handleSave} disabled={!isDirty} size="sm">
                                                    <Save />
                                                </Button>
                                            </div>
                                            <ScrollArea className="max-h-[40vh]">
                                                <KeyValueInput
                                                    bind="values"
                                                    value={editingProfile.values}
                                                    commit={handleValuesChange}
                                                    type="masked"
                                                />
                                            </ScrollArea>
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