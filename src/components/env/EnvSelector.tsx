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
import { ChevronDown, Check, Settings, Globe, Workflow, AlertTriangle, CircleAlert  } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWorkflowEditor } from "@/contexts/WorkflowEditorContext";
import { Badge } from "@/components/ui/badge";

interface EnvSelectorProps {
  workflowId?: string;
}

export const EnvSelector = ({ workflowId }: EnvSelectorProps) => {
  const navigate = useNavigate();
  const { 
    globalEnvs, 
    getActiveEnv,
    workflowEnvs,
    setWorkflowEnvs,
    activeProjectEnvId, 
    setActiveProjectEnv,
    setWorkflowActiveEnv,
  } = useEnv();
  
  setWorkflowEnvs(workflowId)
  const { isDirty } = useWorkflowEditor();

  const activeEnv = getActiveEnv();
  const hasWorkflowOverride = workflowId && workflowEnvs?.activeEnvId;
  const defaultEnv = globalEnvs.find((e) => e.isDefault);
  
  const deviatesFromDefault = activeProjectEnvId && activeProjectEnvId !== defaultEnv?.id;

  const handleWorkflowEnvSelect = (envId: string | null) => {
    if (workflowId) { setWorkflowActiveEnv(workflowId, envId); }
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
            <CircleAlert className="h-3 w-3 text-red-500" />
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
        {globalEnvs.map((env) => (
          <DropdownMenuItem
            key={env.id}
            onClick={() => setActiveProjectEnv(env.id)}
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

        {workflowId && workflowEnvs && workflowEnvs.envProfiles.length > 0 && (
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
              {!workflowEnvs.activeEnvId && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            {workflowEnvs.envProfiles.map((env) => (
              <DropdownMenuItem
                key={env.id}
                onClick={() => handleWorkflowEnvSelect(env.id)}
                className="flex items-center justify-between"
              >
                <span>{env.name}</span>
                {workflowEnvs.activeEnvId === env.id && <Check className="h-4 w-4" />}
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
