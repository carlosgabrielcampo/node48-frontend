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
      type: nodeTemplates[step.type]?.type || "default",
      position: step.position,
      data: {
        name: step.name,
        type: step.type,
        mainType: nodeTemplates[step.type]?.mainType || "default",
        onDelete,
        onClick,
        // Preserve all step properties in data
        config: step.config,
        nextStepId: step.nextStepId,
        errorStepId: step.errorStepId,
        outputVar: step.outputVar,
        list: step.list,
        workflowId: step.workflowId,
        createdAtUTC: step.createdAtUTC,
      },
    });

    // Create edges based on connections object if available
    if (step.connections) {
      Object.entries(step.connections).forEach(([handleId, targetId]) => {
        if (targetId) {
          const isError = handleId === step.errorStepId;
          edges.push({
            id: `${step.id}-${handleId}-${targetId}`,
            source: step.id,
            sourceHandle: handleId,
            target: targetId,
            type: "smoothstep",
            animated: false,
            style: { 
              stroke: isError ? "hsl(var(--destructive))" : "hsl(var(--connection-line))", 
              strokeWidth: 2 
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isError ? "hsl(var(--destructive))" : "hsl(var(--connection-line))",
            },
          });
        }
      });
    } else {
      // Fallback to old parsing logic
      // Create edges based on nextStepId
      if (step.nextStepId) {
        edges.push({
          id: `${step.id}-${step.nextStepId}`,
          source: step.id,
          sourceHandle: step.nextStepId,
          target: step.nextStepId,
          type: "smoothstep",
          animated: false,
          style: { stroke: "hsl(var(--connection-line))", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "hsl(var(--connection-line))",
          },
        });
      }

      // For api nodes, create edge for errorStepId
      if (step.type === "api_call" && step.errorStepId) {
        edges.push({
          id: `${step.id}-error-${step.errorStepId}`,
          source: step.id,
          sourceHandle: step.errorStepId,
          target: step.errorStepId,
          type: "smoothstep",
          animated: false,
          style: { stroke: "hsl(var(--destructive))", strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "hsl(var(--destructive))",
          },
        });
      }

      // For conditional and loop nodes, create edges from config entries
      if ((step.type === "conditional_operation" || step.type === "loop_operation") && Array.isArray(step.config)) {
        step.config.forEach((configItem, index) => {
          if (configItem.nextStepId) {
            edges.push({
              id: `${step.id}-config-${index}-${configItem.nextStepId}`,
              source: step.id,
              sourceHandle: configItem.nextStepId,
              target: configItem.nextStepId,
              type: "smoothstep",
              animated: false,
              style: { stroke: "hsl(var(--connection-line))", strokeWidth: 2 },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: "hsl(var(--connection-line))",
              },
            });
          }
        });
      }
    }
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
