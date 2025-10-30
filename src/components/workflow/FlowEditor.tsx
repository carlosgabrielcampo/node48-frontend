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
import { CustomNode } from "./CustomNode";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { WorkflowData } from "@/types/workflow";

const nodeTypes = {
  custom: CustomNode,
};

interface FlowEditorProps {
  onAddNode: () => void;
  onNodeAdded?: (type: "action" | "operation", name: string) => void;
}

export const FlowEditor = ({ onAddNode, onNodeAdded }: FlowEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [pendingNode, setPendingNode] = useState<{ type: "action" | "operation"; name: string } | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Expose addNode through callback
  useEffect(() => {
    if (onNodeAdded) {
      // Create a method that can be called externally
      (window as any).__addWorkflowNode = (type: "action" | "operation", name: string) => {
        setPendingNode({ type, name });
      };
    }
    return () => {
      delete (window as any).__addWorkflowNode;
    };
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
        id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
        type: "smoothstep",
        animated: true,
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
    (type: "action" | "operation", name: string) => {
      const newNode: Node = {
        id: `node-${Date.now()}`,
        type: "custom",
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + 100,
        },
        data: {
          name,
          type,
          onDelete: handleDeleteNode,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      toast.success(`Added ${name}`);
    },
    [setNodes, handleDeleteNode]
  );

  // Handle pending node addition
  useEffect(() => {
    if (pendingNode) {
      handleAddNode(pendingNode.type, pendingNode.name);
      setPendingNode(null);
    }
  }, [pendingNode, handleAddNode]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        // Delete selected nodes
        const selectedNodes = selectedElements.filter((id) =>
          nodes.some((n) => n.id === id)
        );
        const selectedEdges = selectedElements.filter((id) =>
          edges.some((e) => e.id === id)
        );

        if (selectedNodes.length > 0) {
          setNodes((nds) => nds.filter((node) => !selectedNodes.includes(node.id)));
          setEdges((eds) =>
            eds.filter(
              (edge) =>
                !selectedNodes.includes(edge.source) &&
                !selectedNodes.includes(edge.target)
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

  const handleExport = useCallback(() => {
    const workflowData: WorkflowData = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.data.type,
        name: node.data.name,
        position: node.position,
      })),
      connections: edges.map((edge, index) => ({
        id: edge.id,
        source: {
          nodeId: edge.source,
          outputIndex: 0,
        },
        target: {
          nodeId: edge.target,
          inputIndex: 0,
        },
      })),
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Workflow exported");
  }, [nodes, edges]);

  const handleImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workflowData: WorkflowData = JSON.parse(e.target?.result as string);

          // Convert to ReactFlow format
          const importedNodes: Node[] = workflowData.nodes.map((node) => ({
            id: node.id,
            type: "custom",
            position: node.position,
            data: {
              name: node.name,
              type: node.type,
              onDelete: handleDeleteNode,
            },
          }));

          const importedEdges: Edge[] = workflowData.connections.map((conn) => ({
            id: conn.id,
            source: conn.source.nodeId,
            target: conn.target.nodeId,
            type: "smoothstep",
            animated: true,
            style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "hsl(var(--primary))",
            },
          }));

          setNodes(importedNodes);
          setEdges(importedEdges);
          toast.success("Workflow imported");
        } catch (error) {
          toast.error("Failed to import workflow");
          console.error(error);
        }
      };
      reader.readAsText(file);
      event.target.value = "";
    },
    [setNodes, setEdges, handleDeleteNode]
  );

  return (
    <div className="flex-1 flex flex-col" ref={reactFlowWrapper}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-4 border-b bg-background">
        <Button onClick={onAddNode} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Node
        </Button>
        <Button onClick={handleExport} size="sm" variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
        <label>
          <Button size="sm" variant="outline" className="gap-2" asChild>
            <span>
              <Upload className="h-4 w-4" />
              Import
            </span>
          </Button>
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
        <div className="flex-1" />
        <div className="text-sm text-muted-foreground">
          {nodes.length} nodes, {edges.length} connections
        </div>
      </div>

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
          <MiniMap
            nodeColor={(node) => {
              return node.data.type === "action"
                ? "hsl(var(--primary))"
                : "hsl(var(--secondary))";
            }}
          />
        </ReactFlow>
      </div>

      {/* Quick add buttons */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onAddNode}
            className="gap-2"
            aria-label="Add first workflow step"
          >
            <Plus className="h-5 w-5" />
            Add first step
          </Button>
        </div>
      )}
    </div>
  );
};
