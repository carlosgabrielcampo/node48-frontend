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
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { toast } from "sonner";
import { FlowEditorProps } from "@/types/workflows";
import { parseWorkflowJSON } from "@/lib/workflowParser";
import { UnifiedNode } from "../nodes/UnifiedNode";
import { createEmptyNode } from "../nodes/NodeDataStructure";
import { WorkflowJSON } from "@/types/workflows";
import { NodeConfigPanel } from "../panels/NodePanel";
import { createEdge } from "../edges/EdgeDataStructure";
import { Button } from "@/components/ui/button";
import { Maximize, ZoomIn, ZoomOut, ChevronsRightLeft } from "lucide-react";

const nodeTypes = { custom: UnifiedNode };

export const FlowEditor = ({
  edges,
  nodes, 
  setEdges, 
  workflow, 
  setNodes, 
  onNodeAdded, 
  selectedNode,
  onNodesChange, 
  onEdgesChange,
  setSelectedNode,
  configPanelOpen,
  handleNodeClick,
  handleDeleteNode,
  setPendingChanges,
  setConfigPanelOpen,
}: FlowEditorProps) => {

  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [pendingNode, setPendingNode] = useState<any>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [isScreenMoving, setIsScreenMoving] = useState(false);
  const timerRef = useRef<number | null>(null);
  const minimapDelay = 400

  useEffect(() => {
    if (onNodeAdded) { 
      globalThis.__addWorkflowNode = (node) => setPendingNode(node)
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
      const newEdge = createEdge({
        id: connection.sourceHandle,
        source: connection.source,
        sourceHandle: connection.sourceHandle,
        target: connection.target,
      })
      console.log(connection)
      setEdges((eds) => {
        const edgeFound = eds.filter((e) => e.id === newEdge.id )
        if(edgeFound.length > 1 || (edgeFound.length === 1 && edgeFound[0].target)){
          toast.error("Double connection");
          return eds
        }
        toast.success("Connection created");
        return addEdge(newEdge, eds)
      });
    },
    [setEdges]
  );

  const onSelectionChange = useCallback(({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
    const selectedIds = [ ...nodes.map((n) => n.id), ...edges.map((e) => e.id) ];
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

  const handleUpdateNode = useCallback((nodeId: string, parameters: any[], connections: any[]) => {
    setNodes((nds) =>
      nds.map((node: Node) => {
        if(node.id === nodeId) {
          if(JSON.stringify(node.data.parameters) != JSON.stringify(parameters)) setPendingChanges(true)
          return ({ ...node, data: { ...node.data, parameters, connections } })
        } else { return node }
      })
    );
    
    // Update selected node
    if (selectedNode?.id === nodeId) {
      setSelectedNode((prev) => prev ? { ...prev, parameters } : null);
    }
  }, [setNodes, selectedNode, setSelectedNode, setPendingChanges]);

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
        selectedElements.filter((id) => nodes.map((e) =>{ if(e.data.connections[id]) e.data.connections[id] = "" }))

        if (selectedNodes.length > 0) {
          setNodes((nds) => nds.filter((node) => !selectedNodes.includes(node.id)));
          setEdges((eds) => eds.filter((edge) => !selectedNodes.includes(edge.source) && !selectedNodes.includes(edge.target)));
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
      const { nodes: parsedNodes, edges: parsedEdges } = parseWorkflowJSON((workflow as WorkflowJSON), handleDeleteNode, handleNodeClick);
      setNodes(parsedNodes);
      setEdges(parsedEdges);
    } else {
      setNodes([]);
      setEdges([]);
    }
  },[])

  const hideMinimap = () => {
    timerRef.current = window.setTimeout(() => {
      setIsScreenMoving(false);
      timerRef.current = null;
    }, minimapDelay);
  };
  
  const showMinimap = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsScreenMoving(true);
  };  

  function FlowControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return (
    <div className="absolute bottom-4 left-4 flex gap-2 z-50">
      <Button size="icon" onClick={() => zoomIn()} variant="outline"><ZoomIn/></Button>
      <Button size="icon" onClick={() => zoomOut()} variant="outline"><ZoomOut/></Button>
      <Button size="icon" onClick={() => fitView()} variant="outline"><Maximize/></Button>
      <Button size="icon" onClick={() => {}} variant="outline"><ChevronsRightLeft/></Button>
    </div>
  );
}

  return (
    <div className="flex-1 flex flex-col" ref={reactFlowWrapper}>
      {/* Canvas */}
      <div className="flex-1" onKeyDown={handleKeyDown} tabIndex={0} >
        <ReactFlow
          fitView
          nodes={nodes}
          edges={edges}
          minZoom={0.1}
          maxZoom={1.5}
          onClick={hideMinimap}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onMoveEnd={hideMinimap}
          onMoveStart={showMinimap}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          attributionPosition="bottom-left"
          onSelectionChange={onSelectionChange}
          connectionMode={ConnectionMode.Strict}
        >
          <Background className="bg-canvas" gap={20} />
          <FlowControls />
          {isScreenMoving && <MiniMap  nodeColor="hsl(var(--primary))" className="bg-canvas"/>}
        </ReactFlow>
      </div>

      <NodeConfigPanel
        node={selectedNode}
        setEdges={setEdges}
        open={configPanelOpen}
        onUpdate={handleUpdateNode}
        onOpenChange={setConfigPanelOpen}
      />
    </div>
  );
};
