import { Globe, X } from "lucide-react";
import { LabeledDropdown } from "../layout/dropdown"
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { useEnv } from "@/contexts/EnvContext";
import React from "react";
import { EnvProfile } from "@/types/env";

interface ActiveInterface {
    workflowId: string;
    activeLocal: EnvProfile;
    activeGlobal: EnvProfile;
    setActiveLocal: React.ReactEventHandler;
    setActiveGlobal: React.ReactEventHandler;
    handleEnvSwitch: React.ReactEventHandler<Record<string, string>>;
}

export const ActiveTab = ({
    workflowId,
    activeLocal,
    activeGlobal,
    setActiveLocal,
    setActiveGlobal,
    handleEnvSwitch,
}: ActiveInterface
): React.ReactElement => {
    const { allEnvs, removeWorkflowActiveEnv } = useEnv();

    const WorkflowLabeledCard = ({ label, profile, envId }: { label: string; profile: EnvProfile | null; envId: string }) => {
        const removeActiveEnv = async (id, type) => {
            if (!id || !type) return;
            try {
                await removeWorkflowActiveEnv(workflowId, id, type)
                if (type === "global") setActiveGlobal({})
                else setActiveLocal({})
                toast.success("Active environment profile removed");
            } catch (error) {
                console.error(envId, error)
                toast.error("Failed to remove active profile");
            }
        }
        return (
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
                    {profile?.name && (
                        <Button variant="secondary" onClick={() => removeActiveEnv(profile.name, profile.scope)}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        )
    };
    const dropdownOptions = allEnvs?.['global']?.profiles 
        ? Object.values(allEnvs?.['global']?.profiles).map((env) => 
            ({itemProperties: { value: env.id }, display: env.name + (env.isDefault ? " (Default)" : "")})
        )
        : []

    return (
        <div
                className="space-y-4 h-full">
                <div className="space-y-2">
                    <LabeledDropdown
                        label="Select Global Environment"
                        onSelect={(e) => handleEnvSwitch(e.value, "global")}
                        header={<span className="text-sm">{"Select environment..."}</span>}
                        options={dropdownOptions}
                        disabled={dropdownOptions.length ? false : true}
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
}