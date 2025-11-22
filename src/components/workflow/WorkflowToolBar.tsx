import { useCallback, useState, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Play, Copy, Trash2, Download, Plus, Upload } from "lucide-react";
import { toast } from "sonner";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { isWorkflowJSON, parseWorkflowJSON } from "@/lib/workflowParser";
import { WorkflowNode } from "@/types/workflow";
import { MarkerType, Edge, Node } from "reactflow";
import { WorkflowData } from "@/types/workflow";

interface WorkflowToolBarProps {
  workflowId?: string;
  workflowName?: string;
  isActive: boolean;
  onToggleActive: (active: boolean) => Promise<void>;
  nodes: any;
  setNodes: any;
  edges: any;
  setEdges: any;
  setSelectedNode: any;
  selectedNode: any;
  setConfigPanelOpen: any;
  configPanelOpen: any;
  setWorkflowId: (id: string) => void;
  onAddNode: () => void;
  setIsActive: Dispatch<SetStateAction<boolean>>;
}

export const WorkflowToolBar = ({
  setIsActive,
  isActive,
  setSelectedNode,
  setConfigPanelOpen,
  setWorkflowId,
  onAddNode,
  nodes, 
  setNodes, 
  edges, 
  setEdges 
}: WorkflowToolBarProps) => {

  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { open } = useSidebar();

  const onSave = async () => {
    // Simulating API call - replace with actual endpoint
    await new Promise((resolve) => setTimeout(resolve, 500));
    setWorkflowId(`workflow-${Date.now()}`);
  };
  const onRun = async () => {
      // Simulating API call - replace with actual endpoint
    await new Promise((resolve) => setTimeout(resolve, 1000));
  };
  const onToggleActive = async (active: boolean) => {
    // Simulating API call - replace with actual endpoint
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsActive(active);
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      toast.success("Workflow saved successfully");
    } catch (error) {
      toast.error("Failed to save workflow");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };
  const handleRun = async () => {
    setIsRunning(true);
    try {
      await onRun();
      toast.success("Workflow executed successfully");
    } catch (error) {
      toast.error("Failed to execute workflow");
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };
  const handleToggleActive = async (checked: boolean) => {
    setIsToggling(true);
    try {
      await onToggleActive(checked);
      toast.success(`Workflow ${checked ? "activated" : "deactivated"}`);
    } catch (error) {
      toast.error("Failed to update workflow state");
      console.error(error);
    } finally {
      setIsToggling(false);
    }
  };
  const handleDuplicate = () => {
    toast.info("Duplicate feature coming soon");
  };
  const handleDelete = () => {
    toast.info("Delete feature coming soon");
  };
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
    }, [nodes, setConfigPanelOpen, setSelectedNode])

  const handleExport = useCallback(() => {
    const workflowData: WorkflowData = {
      nodes: nodes.map((node) => ({
        id: node.id,
        type: node.data.type,
        name: node.data.name,
        mainType: node.data.mainType,
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
            const { nodes: parsedNodes, edges: parsedEdges } = parseWorkflowJSON(jsonData, handleDeleteNode, handleClickOnNode);
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
  
  const navigate = useNavigate()
  return (
      <div className="flex items-center gap-2 p-4 border-b bg-background">
        <Button 
          onClick={onAddNode} 
          size="sm" 
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Node
        </Button>
        <Button 
          onClick={handleExport} 
          size="sm" variant="outline" className="gap-2">
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
          {/* {nodes.length} nodes, {edges.length} connections */}
        </div>

        <div className="flex items-center gap-2 px-3 py-1 border-r border-border">
          <Switch
            id="workflow-active"
            checked={isActive}
            onCheckedChange={handleToggleActive}
            disabled={isToggling}
            aria-label="Toggle workflow active state"
          />
          <Label htmlFor="workflow-active" className="text-sm cursor-pointer whitespace-nowrap">
            {isActive ? "Active" : "Inactive"}
          </Label>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRun}
          disabled={isRunning}
          aria-label="Execute workflow"
        >
          <Play className="h-4 w-4 mr-2" />
          {isRunning ? "Running..." : "Run"}
        </Button>

        <Button
          size="sm"
          onClick={handleSave}
          disabled={isSaving}
          aria-label="Save workflow"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save"}
        </Button>

        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDuplicate}
            aria-label="Duplicate workflow"
          >
            <Copy className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            aria-label="Delete workflow"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
  );
};
