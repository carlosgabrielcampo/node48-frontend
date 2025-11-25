import { Node, Edge, MarkerType } from "reactflow";
import { v4 as uuidv4 } from 'uuid';
import { createNode } from "@/components/nodes/NodeDataStructure";
// Workflow JSON format (from backend)
import { WorkflowJSON } from "@/types/workflows";

export const parseWorkflowJSON = (
  workflowJSON: WorkflowJSON,
  onDelete: (id: string) => void,
  onClick: (id: string) => void
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Convert each step to a node
  Object.values(workflowJSON.steps).forEach((step) => {
    nodes.push(createNode({id: step.id, position: step.position, onClick, onDelete, ...step }));

    Object.entries(step.connections).forEach(([handleId, targetId]) => {
        edges.push({
          id: uuidv4(),
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
