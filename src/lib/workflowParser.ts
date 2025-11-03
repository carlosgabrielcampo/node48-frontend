import { Node, Edge, MarkerType } from "reactflow";

// Workflow JSON format (from backend)
export interface WorkflowStep {
  id: string;
  workflowId?: string;
  name?: string;
  type: string;
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

/**
 * Converts workflow JSON format to React Flow format
 */
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

  // Determine mainType based on step type
  const getMainType = (type: string): string => {
    if (type === "csv" || type === "loop") return "operation";
    if (type === "api" || type === "condition") return "action";
    return "custom";
  };

  // Convert each step to a node
  Object.values(workflowJSON.steps).forEach((step) => {
    const mainType = getMainType(step.type);
    
    nodes.push({
      id: step.id,
      type: mainType,
      position: step.position,
      data: {
        name: step.name || step.type,
        mainType,
        type: step.type,
        onDelete,
        onClick,
        // Store all step data for config panel
        ...step,
      },
    });

    // Add edge from this step's nextStepId
    if (step.nextStepId) {
      addEdge(step.id, step.nextStepId);
    }

    // Add edge from errorStepId (for api nodes)
    if (step.errorStepId) {
      addEdge(step.id, step.errorStepId, "error");
    }

    // Handle nested nextStepId in config arrays
    if (Array.isArray(step.config)) {
      step.config.forEach((configEntry, index) => {
        if (configEntry.nextStepId) {
          addEdge(step.id, configEntry.nextStepId, `config[${index}]`);
        }

        // For condition nodes, check nested conditions
        if (Array.isArray(configEntry.condition)) {
          // This is a condition block, already handled by configEntry.nextStepId
        }
      });
    }

    // Handle Conditions array (alternative format)
    if (Array.isArray(step.Conditions)) {
      step.Conditions.forEach((conditionBlock, index) => {
        if (conditionBlock.nextStepId) {
          addEdge(step.id, conditionBlock.nextStepId, `condition[${index}]`);
        }
      });
    }
  });

  return { nodes, edges };
};

/**
 * Detects if JSON is in workflow format (has steps object)
 */
export const isWorkflowJSON = (data: any): data is WorkflowJSON => {
  return (
    data &&
    typeof data === "object" &&
    "steps" in data &&
    typeof data.steps === "object" &&
    "startStep" in data
  );
};
