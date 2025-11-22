import { useState, useCallback } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { WorkflowSidebar } from "@/components/workflow/WorkflowSidebar";
import { WorkflowTopBar } from "@/components/workflow/WorkflowTopBar";
import { FlowEditor } from "@/components/workflow/FlowEditor";
import { WorkflowToolBar } from "@/components/workflow/WorkflowToolBar";
import { NodeTypeDrawer } from "@/components/nodes/NodeTypeDrawer";
import { useEdgesState, useNodesState } from "reactflow";
import { WorkflowNode } from "@/types/workflow";

const Workflow = ({workflow}) => {
  const [isActive, setIsActive] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | undefined>();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);

  const handleAddNode = useCallback(() => { setIsDrawerOpen(true); }, []);
  const handleNodeAdded = useCallback(({mainType, type, name}) => {
    // Trigger node addition in FlowEditor
    if ((window as any).__addWorkflowNode) {
      (window as any).__addWorkflowNode({mainType, type, name});
    }
    setIsDrawerOpen(false);
  }, []);


  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <WorkflowSidebar />
        <div className="flex-1 flex flex-col transition-all duration-200">
          <WorkflowTopBar workflowName={workflow?.name || "Untitled Workflow"} />
          <WorkflowToolBar
            setIsActive={setIsActive}
            setWorkflowId={setWorkflowId}
            isActive={isActive}
            nodes={nodes} 
            setNodes={setNodes} 
            edges={edges} 
            setEdges={setEdges}
            setSelectedNode={setSelectedNode}
            selectedNode={selectedNode}
            setConfigPanelOpen={setConfigPanelOpen}
            configPanelOpen={configPanelOpen}
            onAddNode={handleAddNode}
          />
          <FlowEditor 
            onAddNode={handleAddNode} 
            workflow={workflow} 
            nodes={nodes} 
            setNodes={setNodes} 
            onNodesChange={onNodesChange}
            edges={edges} 
            setEdges={setEdges}
            onEdgesChange={onEdgesChange}
            setSelectedNode={setSelectedNode}
            selectedNode={selectedNode}
            setConfigPanelOpen={setConfigPanelOpen}
            configPanelOpen={configPanelOpen}
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
