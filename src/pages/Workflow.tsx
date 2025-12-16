import { useState, useCallback } from "react";
import { WorkflowTopBar } from "@/components/workflow/WorkflowTopBar";
import { FlowEditor } from "@/components/workflow/FlowEditor";
import { WorkflowToolBar } from "@/components/workflow/WorkflowToolBar";
import { NodeTypeDrawer } from "@/components/nodes/NodeTypeDrawer";
import { useEdgesState, useNodesState } from "reactflow";
import { WorkflowNode } from "@/types/configPanels";
import { toast } from "sonner";
interface Window {
  __addWorkflowNode?: (args: {
    type: string;
    connections: any;
  }) => void;
}

const Workflow = ({workflow}) => {
  const [isActive, setIsActive] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [workflowId, setWorkflowId] = useState<string | undefined>();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false)
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const handleNodeClick = useCallback((node) => {
    const workflowNode: WorkflowNode = {
      id: node.id,
      name: node?.name,
      type: node?.type,
      data: node?.data,
      parameters: node?.parameters,
      list: node?.list,
      workflowId: node?.workflowId,
      createdAtUTC: node?.createdAtUTC,
    };
    setSelectedNode(workflowNode);
    setConfigPanelOpen(true);
  }, [setConfigPanelOpen, setSelectedNode]);
  const handleNodeAdded = useCallback((node) => {
    if ((window as Window).__addWorkflowNode) {
      (window as Window).__addWorkflowNode(node);
    }
    setIsDrawerOpen(false);
  }, []);
  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      toast.success("Node deleted");
    },
    [setNodes, setEdges]
  );

  return (
    <div className="min-h-screen flex min-w-screen bg-background">
      <div className="flex-1 flex flex-col transition-all duration-200">
        <WorkflowTopBar workflowName={workflow?.name || "Untitled Workflow"} />
        <WorkflowToolBar
          nodes={nodes} 
          edges={edges}
          workflow={workflow}
          isActive={isActive}
          selectedNode={selectedNode}
          pendingChanges={pendingChanges}
          configPanelOpen={configPanelOpen}
          setNodes={setNodes}
          setEdges={setEdges}
          setIsActive={setIsActive}
          setWorkflowId={setWorkflowId}
          setSelectedNode={setSelectedNode}
          setIsDrawerOpen={setIsDrawerOpen}
          handleNodeClick={handleNodeClick}
          handleDeleteNode={handleDeleteNode}
          setPendingChanges={setPendingChanges}
          setConfigPanelOpen={setConfigPanelOpen}
        />
        <FlowEditor
          nodes={nodes}
          edges={edges} 
          workflow={workflow}
          selectedNode={selectedNode}
          configPanelOpen={configPanelOpen}
          setNodes={setNodes}
          setEdges={setEdges}
          onNodeAdded={handleNodeAdded}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          setSelectedNode={setSelectedNode}
          handleNodeClick={handleNodeClick}
          handleDeleteNode={handleDeleteNode}
          setConfigPanelOpen={setConfigPanelOpen}
          setPendingChanges={setPendingChanges}
        />
        <NodeTypeDrawer
          open={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          onSelectNodeType={handleNodeAdded}
          />
        </div>
      </div>
  );
};

export default Workflow;
