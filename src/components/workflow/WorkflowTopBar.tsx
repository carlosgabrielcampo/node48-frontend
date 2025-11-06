import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Play } from "lucide-react";
import { toast } from "sonner";
import { SidebarTrigger } from "../ui/sidebar";


interface WorkflowTopBarProps {
  workflowId?: string;
  onSave: () => Promise<void>;
  onRun: () => Promise<void>;
  isActive: boolean;
  onToggleActive: (active: boolean) => Promise<void>;
}

export const WorkflowTopBar = ({
  workflowId,
  onSave,
  onRun,
  isActive,
  onToggleActive,
}: WorkflowTopBarProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      toast.success("Workflow saved successfully");
    } catch (error) {
      toast.error("Failed to save workflow");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      await onRun();
      toast.success("Workflow executed successfully");
    } catch (error) {
      toast.error("Failed to execute workflow");
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleToggleActive = async (checked: boolean) => {
    setIsToggling(true);
    try {
      await onToggleActive(checked);
      toast.success(`Workflow ${checked ? "activated" : "deactivated"}`);
    } catch (error) {
      toast.error("Failed to update workflow state");
      console.error(error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="absolute"  aria-label="Toggle sidebar" />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Switch
            id="workflow-active"
            checked={isActive}
            onCheckedChange={handleToggleActive}
            disabled={isToggling}
            aria-label="Toggle workflow active state"
          />
          <Label htmlFor="workflow-active" className="text-sm cursor-pointer">
            {isActive ? "Active" : "Inactive"}
          </Label>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRun}
          disabled={isRunning}
          aria-label="Execute workflow"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? "Running..." : "Run"}
        </Button>

        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save workflow"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </header>
  );
};
