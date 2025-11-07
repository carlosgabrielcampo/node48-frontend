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

  // Convert each step to a node
  Object.values(workflowJSON.steps).forEach((step) => {
    nodes.push({
      id: step.id,
      type: "custom",
      position: step.position,
      data: {
        ...step,
        onDelete,
        onClick,
      },
    });

    Object.entries(step.connections).forEach(([handleId, targetId]) => {
        edges.push({
          id: `${step.id}-${handleId}-${targetId}`,
          source: step.id,
          sourceHandle: handleId,
          target: targetId,
          type: "smoothstep",
          animated: false,
          style: { 
            color: "hsl(var(--connection-line))",
            stroke: "hsl(var(--connection-line))", 
            strokeWidth: 2 
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "hsl(var(--connection-line))",
          },
        });
    });
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
