import { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  Edge,
  Node,
  ConnectionMode,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { toast } from "sonner";
import { WorkflowNode } from "@/types/configPanels";
import { v4 as uuidv4 } from 'uuid'
import { FlowEditorProps } from "@/types/workflows";
import { parseWorkflowJSON } from "@/lib/workflowParser";
import { UnifiedNode } from "../nodes/UnifiedNode";
import { NodeConfigPanel } from "../config-panels/NodeConfigPanel";
import { createEmptyNode } from "../nodes/NodeDataStructure";
import { WorkflowJSON } from "@/types/workflows";

const nodeTypes = { custom: UnifiedNode };

export const FlowEditor = ({
  onNodeAdded, 
  workflow, 
  nodes, 
  setNodes, 
  onNodesChange, 
  edges, 
  setEdges, 
  onEdgesChange,
  setSelectedNode,
  selectedNode,
  setConfigPanelOpen,
  configPanelOpen,
  handleNodeClick,
  handleDeleteNode
}: FlowEditorProps) => {

  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [pendingNode, setPendingNode] = useState<any>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onNodeAdded) {
      globalThis.__addWorkflowNode = (node) => {
      console.log({node})
        setPendingNode(node); 
      };
    }
    return () => { delete (globalThis).__addWorkflowNode; };
  }, [onNodeAdded]);

  const onConnect = useCallback(
    (connection: Connection) => {
      // Prevent self-connections
      if (connection.source === connection.target) {
        toast.error("Cannot connect a node to itself");
        return;
      }
      const newEdge: Edge = {
        ...connection,
        id: uuidv4(),
        type: "smoothstep",
        animated: false,
        style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "hsl(var(--primary))",
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
      toast.success("Connection created");
    },
    [setEdges]
  );

  const onSelectionChange = useCallback(({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
    const selectedIds = [
      ...nodes.map((n) => n.id),
      ...edges.map((e) => e.id),
    ];
    setSelectedElements(selectedIds);
  }, []);

  const handleAddNode = useCallback(
    ({type}) => {
      const newNode: Node = createEmptyNode({ type, onDelete: handleDeleteNode, onClick: handleNodeClick });
      setNodes((nds) => [...nds, newNode]);
      toast.success(`Added ${type}`);
    },
    [setNodes, handleDeleteNode, handleNodeClick ]
  );

 

  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes((nds) =>
      nds.map((node: Node) =>
        node.id === nodeId
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                ...updates,
                name: updates.name || node.data.name,
                parameters: updates.parameters !== undefined ? updates.parameters : node.data.parameters,
                list: updates.list !== undefined ? updates.list : node.data.list,
              }, 
            }
          : node
      )
    );
    
    // Update selected node
    if (selectedNode?.id === nodeId) {
      setSelectedNode((prev) => prev ? { ...prev, ...updates } : null);
    }
    
    toast.success("Node updated");
  }, [setNodes, selectedNode, setSelectedNode]);

  // Handle pending node addition
  useEffect(() => {
    if (pendingNode) {
      handleAddNode(pendingNode);
      setPendingNode(null);
    }
  }, [pendingNode, handleAddNode]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        // Delete selected nodes
        const selectedNodes = selectedElements.filter((id) => nodes.some((n) => n.id === id) );
        const selectedEdges = selectedElements.filter((id) => edges.some((e) => e.id === id) );

        if (selectedNodes.length > 0) {
          setNodes((nds) => nds.filter((node) => !selectedNodes.includes(node.id)));
          setEdges((eds) =>
            eds.filter(
              (edge) =>
                !selectedNodes.includes(edge.source) && !selectedNodes.includes(edge.target)
            )
          );
          toast.success(`Deleted ${selectedNodes.length} node(s)`);
        }

        if (selectedEdges.length > 0) {
          setEdges((eds) => eds.filter((edge) => !selectedEdges.includes(edge.id)));
          toast.success(`Deleted ${selectedEdges.length} connection(s)`);
        }
      }
    },
    [selectedElements, nodes, edges, setNodes, setEdges]
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
  
  console.log({edges, nodes})
  return (
    <div className="flex-1 flex flex-col" ref={reactFlowWrapper}>
      {/* Canvas */}
      <div className="flex-1" onKeyDown={handleKeyDown} tabIndex={0}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Strict}
          fitView
          attributionPosition="bottom-left"
        >
          <Background className="bg-canvas" gap={20} />
          <Controls />
          <MiniMap nodeColor="hsl(var(--primary))" className="bg-canvas"/>
        </ReactFlow>
      </div>

      <NodeConfigPanel
        node={selectedNode}
        open={configPanelOpen}
        onOpenChange={setConfigPanelOpen}
        onUpdate={handleUpdateNode}
      />
    </div>
  );
};
