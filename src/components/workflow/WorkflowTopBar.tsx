import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Play, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSidebar } from "@/components/ui/sidebar";

interface WorkflowTopBarProps {
  workflowId?: string;
  workflowName?: string;
  onSave: () => Promise<void>;
  onRun: () => Promise<void>;
  isActive: boolean;
  onToggleActive: (active: boolean) => Promise<void>;
}

export const WorkflowTopBar = ({
  workflowId,
  workflowName = "Untitled Workflow",
  onSave,
  onRun,
  isActive,
  onToggleActive,
}: WorkflowTopBarProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { open } = useSidebar();

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

  const handleDuplicate = () => {
    toast.info("Duplicate feature coming soon");
  };

  const handleDelete = () => {
    toast.info("Delete feature coming soon");
  };

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Workflow Title - Moves with sidebar state */}
      <div 
        className="flex items-center gap-4 transition-all duration-200"
        style={{ marginLeft: open ? '0' : '0' }}
      >
        <h1 className="text-lg font-semibold text-foreground truncate max-w-xs">
          {workflowName}
        </h1>
      </div>

      {/* Unified Action Bar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 border-r border-border">
          <Switch
            id="workflow-active"
            checked={isActive}
            onCheckedChange={handleToggleActive}
            disabled={isToggling}
            aria-label="Toggle workflow active state"
          />
          <Label htmlFor="workflow-active" className="text-sm cursor-pointer whitespace-nowrap">
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

        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDuplicate}
            aria-label="Duplicate workflow"
          >
            <Copy className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            aria-label="Delete workflow"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </header>
  );
};
