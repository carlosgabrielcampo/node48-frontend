import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { WorkflowSidebar } from "@/components/workflow/WorkflowSidebar";
import { WorkflowTopBar } from "@/components/workflow/WorkflowTopBar";
import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { NodeDrawer } from "@/components/workflow/NodeDrawer";
import { toast } from "sonner";

interface Node {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
}

const Workflow = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | undefined>();

  const handleAddNode = () => {
    setIsDrawerOpen(true);
  };

  const handleSelectNode = (template: { id: string; type: string; name: string }) => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: template.type,
      label: template.name,
      position: {
        x: Math.random() * 400 + 200,
        y: Math.random() * 300 + 100,
      },
    };
    setNodes([...nodes, newNode]);
    toast.success(`Added ${template.name} to workflow`);
  };

  const handleNodeMove = (nodeId: string, position: { x: number; y: number }) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      )
    );
  };

  const handleSave = async () => {
    try {
      // Simulating API call - replace with actual endpoint
      // const response = await fetch('/api/workflow', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ nodes, isActive }),
      // });
      // const data = await response.json();
      // setWorkflowId(data.id);

      // Mock successful save
      await new Promise((resolve) => setTimeout(resolve, 500));
      setWorkflowId(`workflow-${Date.now()}`);
    } catch (error) {
      throw error;
    }
  };

  const handleRun = async () => {
    try {
      // Simulating API call - replace with actual endpoint
      // await fetch(`/api/workflow/${workflowId}/execute`, {
      //   method: 'POST',
      // });

      // Mock successful execution
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      throw error;
    }
  };

  const handleToggleActive = async (active: boolean) => {
    try {
      // Simulating API call - replace with actual endpoint
      // await fetch(`/api/workflow/${workflowId}/state`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ active }),
      // });

      // Mock successful toggle
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

          <WorkflowCanvas
            nodes={nodes}
            onAddNode={handleAddNode}
            onNodeMove={handleNodeMove}
          />

          <NodeDrawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            onSelectNode={handleSelectNode}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Workflow;
