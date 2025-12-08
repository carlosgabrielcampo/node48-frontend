import { Node, Edge, MarkerType } from "reactflow";
import { v4 as uuidv4 } from 'uuid';
import { createNode } from "@/components/nodes/NodeDataStructure";
// Workflow JSON format (from backend)
import { WorkflowJSON } from "@/types/workflows";
import { createEdge } from "@/components/edges/EdgeDataStructure";

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
    Object.entries(step.connections).forEach(([handleId, targetId], index) => {
      edges.push(createEdge({id: handleId, source: step.id, sourceHandle: handleId, target: targetId, label: String(index)}));
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
