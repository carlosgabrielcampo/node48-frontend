import { useEnv } from "@/contexts/EnvContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check, Settings, Globe, Workflow, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWorkflowEditor } from "@/contexts/WorkflowEditorContext";
import { Badge } from "@/components/ui/badge";

interface EnvSelectorProps {
  workflowId?: string;
}

export const EnvSelector = ({ workflowId }: EnvSelectorProps) => {
  const navigate = useNavigate();
  const { 
    projectEnvs, 
    activeProjectEnvId, 
    setActiveProjectEnv,
    workflowEnvMeta,
    setWorkflowActiveEnv,
    getActiveEnv,
  } = useEnv();
  
  const { isDirty } = useWorkflowEditor();

  const activeEnv = getActiveEnv();
  const hasWorkflowOverride = workflowId && workflowEnvMeta?.activeEnvId;
  const defaultEnv = projectEnvs.find((e) => e.isDefault);
  const deviatesFromDefault = activeProjectEnvId && activeProjectEnvId !== defaultEnv?.id;

  const handleProjectEnvSelect = (envId: string) => {
    setActiveProjectEnv(envId);
  };

  const handleWorkflowEnvSelect = (envId: string | null) => {
    if (workflowId) {
      setWorkflowActiveEnv(workflowId, envId);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="max-w-[100px] truncate">
            {activeEnv?.name || "No Env"}
          </span>
          {(hasWorkflowOverride || deviatesFromDefault) && (
            <AlertTriangle className="h-3 w-3 text-yellow-500" />
          )}
          {isDirty && <Badge variant="destructive" className="h-2 w-2 p-0 rounded-full" />}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Project Environments
        </DropdownMenuLabel>
        {projectEnvs.map((env) => (
          <DropdownMenuItem
            key={env.id}
            onClick={() => handleProjectEnvSelect(env.id)}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              {env.name}
              {env.isDefault && (
                <Badge variant="secondary" className="text-xs">Default</Badge>
              )}
            </span>
            {activeProjectEnvId === env.id && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}

        {workflowId && workflowEnvMeta && workflowEnvMeta.envProfiles.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="flex items-center gap-2">
              <Workflow className="h-4 w-4" />
              Workflow Overrides
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => handleWorkflowEnvSelect(null)}
              className="flex items-center justify-between"
            >
              <span className="text-muted-foreground">Use Project Env</span>
              {!workflowEnvMeta.activeEnvId && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            {workflowEnvMeta.envProfiles.map((env) => (
              <DropdownMenuItem
                key={env.id}
                onClick={() => handleWorkflowEnvSelect(env.id)}
                className="flex items-center justify-between"
              >
                <span>{env.name}</span>
                {workflowEnvMeta.activeEnvId === env.id && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            ))}
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/settings")} className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Manage Environments
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
