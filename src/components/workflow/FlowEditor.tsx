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
import { CustomNode } from "./nodes/CustomNode";
import { Button } from "@/components/ui/button";
import { Download, Upload, Plus } from "lucide-react";
import { toast } from "sonner";
import { WorkflowData, WorkflowNode } from "@/types/workflow";
import { v4 as uuidv4 } from 'uuid'
import { NodeType } from "@/types/workflow";
import { NodeConfigPanel } from "./NodeConfigPanel";
import { parseWorkflowJSON, isWorkflowJSON } from "@/lib/workflowParser";
const nodeTypes = {
  custom: CustomNode,
  action: CustomNode,
  trigger: CustomNode,
  operation: CustomNode,
};

interface FlowEditorProps {
  onAddNode: () => void;
  onNodeAdded?: ({mainType, type, name}) => void;
}

export const FlowEditor = ({ onAddNode, onNodeAdded }: FlowEditorProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [pendingNode, setPendingNode] = useState<{ mainType: string; type: string; name: string } | null>(null);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [configPanelOpen, setConfigPanelOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Expose addNode through callback
  useEffect(() => {
    if (onNodeAdded) {
      (window as any).__addWorkflowNode = (template: { mainType: string; type: string; name: string }) => { 
        console.log("setPendingNode", template)
        setPendingNode(template); 
      };
    }
    return () => { delete (window as any).__addWorkflowNode; };
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

  const handleClickOnNode = useCallback((id: string) => {
    const node = nodes.find(n => n.id === id);
    if (node) {
      const workflowNode: WorkflowNode = {
        id: node.id,
        name: node.data.name,
        position: node.position,
        type: node.data.type,
        data: node.data,
        // Extract common workflow properties from data
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
    }
  }, [nodes])

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
          onClick: handleClickOnNode
        }
      };
      setNodes((nds) => [...nds, newNode]);
      toast.success(`Added ${name}`);
    },
    [setNodes, handleDeleteNode, handleClickOnNode]
  );

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const workflowNode: WorkflowNode = {
      id: node.id,
      name: node.data.name,
      position: node.position,
      type: node.data.type,
      data: node.data,
      // Extract common workflow properties from data
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
  }, [setNodes, selectedNode]);

  // Handle pending node addition
  useEffect(() => {
    if (pendingNode) {
      console.log({pendingNode})
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

  const handleExport = useCallback(() => {
    const workflowData: WorkflowData = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.data.type,
        name: node.data.name,
        position: node.position,
        data: node.data
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

  const handleLoadSample = useCallback(async () => {
    try {
      const response = await fetch('/sample-workflow.json');
      const jsonData = await response.json();
      
      if (isWorkflowJSON(jsonData)) {
        const { nodes: parsedNodes, edges: parsedEdges } = parseWorkflowJSON(
          jsonData,
          handleDeleteNode,
          handleClickOnNode
        );
        setNodes(parsedNodes);
        setEdges(parsedEdges);
        toast.success(`Loaded "${jsonData.name}" with ${parsedNodes.length} nodes`);
      } else {
        toast.error("Invalid workflow format");
      }
    } catch (error) {
      toast.error("Failed to load sample workflow");
      console.error(error);
    }
  }, [setNodes, setEdges, handleDeleteNode, handleClickOnNode]);

  const handleImport = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target?.result as string);
          
          // Check if it's the new workflow JSON format
          if (isWorkflowJSON(jsonData)) {
            const { nodes: parsedNodes, edges: parsedEdges } = parseWorkflowJSON(
              jsonData,
              handleDeleteNode,
              handleClickOnNode
            );
            setNodes(parsedNodes);
            setEdges(parsedEdges);
            toast.success(`Workflow "${jsonData.name}" imported with ${parsedNodes.length} nodes`);
          } else {
            // Legacy format
            const workflowData: WorkflowData = jsonData;
            const importedNodes: Node[] = workflowData.nodes.map((node) => ({
              id: node.id,
              position: node.position,
              type: node.data.type,
              data: {
                mainType: node.data.mainType,
                type: node.data.type,
                name: node.name,
                onDelete: handleDeleteNode,
                onClick: handleClickOnNode,
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
          }
        } catch (error) {
          toast.error("Failed to import workflow");
          console.error(error);
        }
      };
      reader.readAsText(file);
      event.target.value = "";
    },
    [setNodes, setEdges, handleDeleteNode, handleClickOnNode]
  );


  return (
    <div className="flex-1 flex flex-col" ref={reactFlowWrapper}>
      <div className="flex items-center gap-2 p-4 border-b bg-background">
        <Button onClick={onAddNode} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Node
        </Button>
        <Button onClick={handleLoadSample} size="sm" variant="secondary" className="gap-2">
          Load Sample
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
          onNodeClick={handleNodeClick}
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
