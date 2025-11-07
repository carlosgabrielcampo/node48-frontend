import { useState, useCallback } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { WorkflowSidebar } from "@/components/workflow/WorkflowSidebar";
import { WorkflowTopBar } from "@/components/workflow/WorkflowTopBar";
import { FlowEditor } from "@/components/workflow/FlowEditor";
import { WorkflowToolBar } from "@/components/workflow/WorkflowToolBar";
import { NodeType } from "@/types/workflow";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NodeTypeDrawer } from "@/components/nodes/NodeTypeDrawer";
import { useEdgesState, useNodesState } from "reactflow";

const Workflow = ({workflow}) => {
  const [isActive, setIsActive] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | undefined>();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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
          <WorkflowTopBar workflowName={workflow?.name || "Untitled Workflow"} />
          <WorkflowToolBar
            onSave={handleSave}
            onRun={handleRun}
            isActive={isActive}
            onToggleActive={handleToggleActive}
            nodes={nodes} 
            setNodes={setNodes} 
            edges={edges} 
            setEdges={setEdges}
          />
          <FlowEditor 
            onAddNode={handleAddNode} 
            onNodeAdded={handleNodeAdded} 
            workflow={workflow} 
            nodes={nodes} 
            setNodes={setNodes} 
            onNodesChange={onNodesChange}
            edges={edges} 
            setEdges={setEdges}
            onEdgesChange={onEdgesChange}
          />
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
