import { useCallback, useRef, useState, useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ConnectionMode,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { toast } from "sonner";
import { WorkflowNode } from "@/types/workflow";
import { v4 as uuidv4 } from 'uuid'

import { parseWorkflowJSON, isWorkflowJSON, WorkflowJSON } from "@/lib/workflowParser";

import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { DefaultNode } from "../nodes/DefaultNode";
import { NodeConfigPanel } from "../config-panels/NodeConfigPanel";

const nodeTypes = { "custom": DefaultNode };

interface FlowEditorProps {
  onNodeAdded?: ({mainType, type, name}) => void;
  workflow: WorkflowJSON | null;
  nodes: any;
  setNodes: any;
  edges: any;
  setEdges: any;
  onEdgesChange: any;
  onNodesChange: any;
  setSelectedNode: any;
  selectedNode: any;
  setConfigPanelOpen: any;
  configPanelOpen: any;
  onAddNode: () => void;
}

export const FlowEditor = ({
  onAddNode,
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
}: FlowEditorProps) => {

  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [pendingNode, setPendingNode] = useState<{ mainType: string; type: string; name: string } | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (onNodeAdded) {
      globalThis.__addWorkflowNode = (template: { mainType: string; type: string; name: string }) => { 
        setPendingNode(template); 
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
        id: `${connection.source}|${connection.target}`,
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

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
      toast.success("Node deleted");
    },
    [setNodes, setEdges]
  );


  const handleAddNode = useCallback(
    ({mainType, type, name}) => {
      const newNode: Node = {
        id: uuidv4(),
        type: mainType,
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100,
        },
        data: {
          name,
          mainType: mainType,
          type: type,
          onDelete: handleDeleteNode,
        }
      };
      setNodes((nds) => [...nds, newNode]);
      toast.success(`Added ${name}`);
    },
    [setNodes, handleDeleteNode ]
  );

  const handleNodeClick = useCallback((node: Node) => {
    console.log("Node Clicked", node)

    const workflowNode: WorkflowNode = {
      id: node.id,
      name: node.data.name,
      position: node.position,
      type: node.data.type,
      data: node.data,
      config: node.data.config,
      nextStepId: node.data.nextStepId,
      errorStepId: node.data.errorStepId,
      outputVar: node.data.outputVar,
      list: node.data.list,
      workflowId: node.data.workflowId,
      createdAtUTC: node.data.createdAtUTC,
    };
    setSelectedNode(workflowNode);
    setConfigPanelOpen(true);
  }, []);

  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<WorkflowNode>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                ...updates,
                name: updates.name || node.data.name,
                config: updates.config !== undefined ? updates.config : node.data.config,
                nextStepId: updates.nextStepId !== undefined ? updates.nextStepId : node.data.nextStepId,
                errorStepId: updates.errorStepId !== undefined ? updates.errorStepId : node.data.errorStepId,
                outputVar: updates.outputVar !== undefined ? updates.outputVar : node.data.outputVar,
                list: updates.list !== undefined ? updates.list : node.data.list,
              }, 
              position: updates.position || node.position 
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
          <MiniMap nodeColor="hsl(var(--primary))"/>
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
