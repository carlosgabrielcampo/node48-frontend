import { useState, useCallback, useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { WorkflowSidebar } from "@/components/workflow/WorkflowSidebar";
import { WorkflowTopBar } from "@/components/workflow/WorkflowTopBar";
import { FlowEditor } from "@/components/workflow/FlowEditor";
import { WorkflowToolBar } from "@/components/workflow/WorkflowToolBar";
import { NodeTypeDrawer } from "@/components/nodes/NodeTypeDrawer";
import { useEdgesState, useNodesState } from "reactflow";
import { WorkflowNode } from "@/types/configPanels";
import { toast } from "sonner";
import { parseWorkflowJSON } from "@/lib/workflowParser";
import { WorkflowJSON } from "@/types/workflows";
import { createEmptyNode } from "@/components/nodes/NodeDataStructure";
import { Node } from "reactflow";
interface Window {
  __addWorkflowNode?: (args: {
    type: string;
    connections: any;
  }) => void;
}

const Workflow = ({workflow}) => {
  const [isActive, setIsActive] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);


  const handleNodeClick = useCallback((node) => {
    console.log({handleNodeClick: node})
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

  const handleAddNode = useCallback(
    ({type}) => {
      const newNode: Node = createEmptyNode({ type, onDelete: handleDeleteNode, onClick: handleNodeClick });
      setNodes((nds) => [...nds, newNode]);
      toast.success(`Added ${type}`);
    },
    [setNodes, handleDeleteNode, handleNodeClick ]
  );

  useEffect(() => {
    if(workflow){
      const { nodes: parsedNodes, edges: parsedEdges } = parseWorkflowJSON(
        (workflow as WorkflowJSON),
        handleDeleteNode,
        handleNodeClick
      );
      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  },[])

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <WorkflowSidebar />
        <div className="flex-1 flex flex-col transition-all duration-200">
          <WorkflowTopBar workflowName={workflow?.name || "Untitled Workflow"} />
          <WorkflowToolBar
            nodes={nodes} 
            edges={edges}
            isActive={isActive}
            setNodes={setNodes}
            setEdges={setEdges}
            setIsActive={setIsActive}
            setIsDrawerOpen={setIsDrawerOpen}
            handleNodeClick={handleNodeClick}
            handleDeleteNode={handleDeleteNode}
          />
          <FlowEditor
            nodes={nodes}
            edges={edges} 
            workflow={workflow}
            configPanelOpen={configPanelOpen}
            setNodes={setNodes} 
            setEdges={setEdges}
            onNodeAdded={handleNodeAdded}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}

            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}

            setConfigPanelOpen={setConfigPanelOpen}
            handleAddNode={handleAddNode}
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
