import { useState, useCallback } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { WorkflowSidebar } from "@/components/workflow/WorkflowSidebar";
import { WorkflowTopBar } from "@/components/workflow/WorkflowTopBar";
import { FlowEditor } from "@/components/workflow/FlowEditor";
import { NodeTypeDrawer } from "@/components/workflow/NodeTypeDrawer";
import { NodeType } from "@/types/workflow";

const Workflow = () => {
  const [isActive, setIsActive] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | undefined>();

  const handleAddNode = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const handleNodeAdded = useCallback((mainType: NodeType, name: string) => {
    console.log({handleNodeAdded: mainType})
    // Trigger node addition in FlowEditor
    if ((window as any).__addWorkflowNode) {
      (window as any).__addWorkflowNode(mainType, name);
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
      <div className="min-h-screen flex w-full">
        <WorkflowSidebar />
        <div className="flex-1 flex flex-col">
          <div className="flex items-center h-14 border-b px-4">
            <SidebarTrigger aria-label="Toggle sidebar" />
          </div>
          <WorkflowTopBar
            workflowId={workflowId}
            onSave={handleSave}
            onRun={handleRun}
            isActive={isActive}
            onToggleActive={handleToggleActive}
          />
          <FlowEditor onAddNode={handleAddNode} onNodeAdded={handleNodeAdded} />
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
