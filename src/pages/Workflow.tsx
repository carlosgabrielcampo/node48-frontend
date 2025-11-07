import { useState, useCallback } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { WorkflowSidebar } from "@/components/workflow/WorkflowSidebar";
import { WorkflowTopBar } from "@/components/workflow/WorkflowTopBar";
import { FlowEditor } from "@/components/workflow/FlowEditor";
import { NodeTypeDrawer } from "@/components/workflow/nodes/NodeTypeDrawer";
import { NodeType } from "@/types/workflow";

const Workflow = ({workflow}) => {
  const [isActive, setIsActive] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | undefined>();

  const handleAddNode = useCallback(() => { setIsDrawerOpen(true); }, []);
  const handleNodeAdded = useCallback(({mainType, type, name}) => {
    // Trigger node addition in FlowEditor
    if ((window as any).__addWorkflowNode) {
      (window as any).__addWorkflowNode({mainType, type, name});
    }
    setIsDrawerOpen(false);
  }, []);
  const handleSave = async () => {
    try {
      // Simulating API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 500));
      setWorkflowId(`workflow-${Date.now()}`);
    } catch (error) {
      throw error;
    }
  };
  const handleRun = async () => {
    try {
      // Simulating API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      throw error;
    }
  };
  const handleToggleActive = async (active: boolean) => {
    try {
      // Simulating API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsActive(active);
    } catch (error) {
      throw error;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <WorkflowSidebar />
        <div className="flex-1 flex flex-col transition-all duration-200">
          <WorkflowTopBar
            workflowId={workflowId}
            workflowName={workflow?.name || "Untitled Workflow"}
            onSave={handleSave}
            onRun={handleRun}
            isActive={isActive}
            onToggleActive={handleToggleActive}
          />
          <FlowEditor onAddNode={handleAddNode} onNodeAdded={handleNodeAdded} workflow={workflow} />
          <NodeTypeDrawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            onSelectNodeType={handleNodeAdded}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Workflow;
