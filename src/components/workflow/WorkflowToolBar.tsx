import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Save, Play, Download, Plus, Upload, Settings2, CircleAlert } from "lucide-react";
import { toast } from "sonner";
import { isWorkflowJSON, parseWorkflowJSON } from "@/lib/workflowParser";
import { MarkerType, Edge, Node } from "reactflow";
import { WorkflowData } from "@/types/panels";
import { WorkflowToolBarProps } from "@/types/workflows";
import { createNode } from "../nodes/NodeDataStructure";
import { exportToWorkflowJSON } from "@/lib/workflowExporter";
import { workflowService } from "@/services/workflowService";
import { WorkflowEnvModal } from "@/components/env/WorkflowEnvModal";
import { EnvSelector } from "@/components/env/EnvSelector";
export const WorkflowToolBar = ({
  setIsActive,
  isActive,
  nodes,
  workflow,
  setNodes,
  edges,
  setEdges,
  pendingChanges,
  setPendingChanges,
  handleNodeClick,
  setIsDrawerOpen,
  handleDeleteNode
}: WorkflowToolBarProps) => {

  const [isSaving, setIsSaving] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [envModalOpen, setEnvModalOpen] = useState(false);
  const getWorkflowJSON = () => exportToWorkflowJSON(
    nodes,
    edges,
    workflow.id,
    workflow.name,
    workflow.description,
    workflow.createdAtUTC
  );

  const onAddNode = useCallback(() => { 
    setIsDrawerOpen(true); 
  }, []);

  const onSave = async () => {
    const workflowJSON = getWorkflowJSON();    
    const savedWorkflow = await workflowService.saveWorkflow(workflowJSON)
    if(savedWorkflow.status !== 200) throw Error("failed to save")
  }
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      setPendingChanges(false)
      toast.success("Workflow saved successfully");
    } catch (error) {
      toast.error("Failed to save workflow");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  }
  const onRun = async () => {
    // Simulating API call - replace with actual endpoint
    await new Promise((resolve) => setTimeout(resolve, 10000));
  };
  const onToggleActive = async (active: boolean) => {
    // Simulating API call - replace with actual endpoint
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsActive(active);
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
  const handleExport = useCallback(() => {    
    const workflowJSON = getWorkflowJSON();
    const blob = new Blob([JSON.stringify(workflowJSON, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `workflow-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Workflow exported");
  }, [nodes, edges, workflow.id, workflow.name]);

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
            const { nodes: parsedNodes, edges: parsedEdges } = parseWorkflowJSON(jsonData, handleDeleteNode, handleNodeClick);
            setNodes(parsedNodes);
            setEdges(parsedEdges);
            toast.success(`Workflow "${jsonData.name}" imported with ${parsedNodes.length} nodes`);
          } else {
            // Legacy format
            const workflowData: WorkflowData = jsonData;
            const importedNodes: Node[] = workflowData.nodes.map((node) => ( 
              createNode({id: node.id, position: node.data.position || {x: 0, y: 0}, connections: node.data.connections, type: node.data.type, onDelete: handleDeleteNode, onClick: handleNodeClick})
            ));
            const importedEdges: Edge[] = workflowData.connections.map((conn) => ({
              id: conn.id,
              source: conn.source.nodeId,
              target: conn.target.nodeId,
              type: "custom",
              animated: true,
              style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
              markerEnd: { type: MarkerType.ArrowClosed, color: "hsl(var(--primary))" },
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
    [setNodes, setEdges, handleDeleteNode, handleNodeClick]
  );

  return (
    <div className="w-full flex items-center justify-between h-16 gap-2 p-4 border-b bg-background overflow-hidden">
      <div>
        <Button variant="default" onClick={onAddNode} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
        </Button>
        <Button onClick={handleExport} size="sm" variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
        </Button>
        <label>
          <Button size="sm" variant="outline" className="gap-2" asChild>
            <span><Upload className="h-4 w-4"/></span>
          </Button>
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>
      </div>
      <div> <h1 className="text-lg font-bold overflow-hidden">{workflow.name}</h1> </div>
      <div className="flex items-center">
        <div className="flex h-8 items-center gap-2 px-3 py-1 border-x mx-2 border-border">
        <Switch id="workflow-active" checked={isActive} onCheckedChange={handleToggleActive} disabled={isToggling} aria-label="Toggle workflow active state" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setEnvModalOpen(true)} aria-label="Workflow environment settings">
            <Settings2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleRun} disabled={isRunning} aria-label="Execute workflow" className={`${isRunning ? "text-muted bg-green-500 disabled:opacity-100" : "" }`}>
            <Play className="h-4 w-4"/>
          </Button>
          <Button variant="default" size="sm" onClick={handleSave} disabled={isSaving} aria-label="Save workflow" className={`${pendingChanges ? "text-muted bg-yellow-500 hover:bg-yellow-500/90" : "bg-primary" }`}>
              <Save className="h-4 w-4"/>
          </Button>
        </div>
      </div>
      
      {/* Workflow Environment Modal */}
      <WorkflowEnvModal open={envModalOpen} onOpenChange={setEnvModalOpen} workflowId={workflow.id} />
    </div>
  );
};
