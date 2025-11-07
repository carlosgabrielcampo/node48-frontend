import { nodeTemplates } from "@/components/workflow/nodes/Templates";
import { Node, Edge, MarkerType } from "reactflow";
import { string } from "zod";

// Workflow JSON format (from backend)
export interface WorkflowStep {
  id: string;
  workflowId?: string;
  name?: string;
  type: string;
  connections: Record<string, string>,
  createdAtUTC?: string;
  position: { x: number; y: number };
  nextStepId?: string;
  errorStepId?: string;
  outputVar?: string;
  config?: any;
  list?: any;
  Conditions?: any[];
}

export interface WorkflowJSON {
  id: string;
  name: string;
  description?: string;
  createdAtUTC?: string;
  updatedAtUTC?: string;
  startStep: string;
  settings?: any;
  steps: Record<string, WorkflowStep>;
}

export const parseWorkflowJSON = (
  workflowJSON: WorkflowJSON,
  onDelete: (id: string) => void,
  onClick: (id: string) => void
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const edgeSet = new Set<string>(); // Track unique edges

  // Helper to add edge if not duplicate
  const addEdge = (sourceId: string, targetId: string, label?: string) => {
    if (!targetId || targetId === "") return;
    
    const edgeId = `${sourceId}|${targetId}`;
    if (edgeSet.has(edgeId)) return;
    
    edgeSet.add(edgeId);
    edges.push({
      id: edgeId,
      source: sourceId,
      target: targetId,
      type: "smoothstep",
      animated: false,
      label,
      style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "hsl(var(--primary))",
      },
    });
  };

  // Convert each step to a node
  Object.values(workflowJSON.steps).forEach((step) => {
    nodes.push({
      id: step.id,
      type: nodeTemplates[step.type].type || "default",
      position: step.position,
      data: {
        name: step.name,
        mainType: nodeTemplates[step.type].mainType,
        type: nodeTemplates[step.type].type,
        onDelete,
        onClick,
        // Store all step data for config panel
        ...step,
      },
    });
    Object.values(step.connections).map((nextStep: string) => addEdge(step.id, nextStep))
  });

  return { nodes, edges };
};

export const isWorkflowJSON = (data: any): data is WorkflowJSON => {
  return (
    data &&
    typeof data === "object" &&
    "steps" in data &&
    typeof data.steps === "object" &&
    "startStep" in data
  );
};
