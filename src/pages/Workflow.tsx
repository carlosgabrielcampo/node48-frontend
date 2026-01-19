import { useState, useCallback } from "react";
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

const Workflow = ({workflow}: {workflow: any}) => {
  const [isActive, setIsActive] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleNodeClick = useCallback((node: any) => {
    const workflowNode: WorkflowNode = {
      id: node.id,
      name: node?.name,
      type: node?.type,
      data: node?.data,
      parameters: node?.parameters,
      list: node?.list,
      workflowId: node?.workflowId,
      createdAtUTC: node?.createdAtUTC,
      connections: node?.connections,
    };
    setSelectedNode(workflowNode);
    setConfigPanelOpen(true);
  }, [setConfigPanelOpen, setSelectedNode]);
  
  const handleNodeAdded = useCallback((node: any) => {
    if ((window as any).__addWorkflowNode) (window as any).__addWorkflowNode(node);
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
        <WorkflowToolBar
          nodes={nodes} 
          edges={edges}
          isDirty={isDirty}
          workflow={workflow}
          isActive={isActive}
          setNodes={setNodes}
          setEdges={setEdges}
          setIsDirty={setIsDirty}
          setIsActive={setIsActive}
          selectedNode={selectedNode}
          configPanelOpen={configPanelOpen}
          setSelectedNode={setSelectedNode}
          setIsDrawerOpen={setIsDrawerOpen}
          handleNodeClick={handleNodeClick}
          handleDeleteNode={handleDeleteNode}
          setConfigPanelOpen={setConfigPanelOpen}
        />
        <FlowEditor
          nodes={nodes}
          edges={edges} 
          workflow={workflow}
          setNodes={setNodes}
          setEdges={setEdges}
          setIsDirty={setIsDirty}
          selectedNode={selectedNode}
          onNodeAdded={handleNodeAdded}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          configPanelOpen={configPanelOpen}
          setSelectedNode={setSelectedNode}
          handleNodeClick={handleNodeClick}
          handleDeleteNode={handleDeleteNode}
          setConfigPanelOpen={setConfigPanelOpen}
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
