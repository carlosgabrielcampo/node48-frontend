import { Node, Edge } from "reactflow";
import { WorkflowJSON, WorkflowStep } from "@/types/workflows";

/**
 * Export React Flow nodes and edges back to WorkflowJSON format
 */
export const exportToWorkflowJSON = (
  nodes: Node[],
  edges: Edge[],
  workflowId: string,
  workflowName: string,
  workflowDescription?: string
): WorkflowJSON => {
  const steps: Record<string, WorkflowStep> = {};
  
  // Convert nodes to steps
  nodes.forEach((node) => {
    const { data } = node;
    
    // Build connections map from edges
    const connections: Record<string, string> = {};
    edges.forEach((edge) => {
      if (edge.source === node.id && edge.sourceHandle) {
        connections[edge.sourceHandle] = edge.target;
      }
    });
    
    steps[node.id] = {
      id: node.id,
      workflowId: data.workflowId || workflowId,
      name: data.name,
      type: data.type,
      position: node.position,
      parameters: data.parameters || [],
      connections,
      createdAtUTC: data.createdAtUTC || new Date().toISOString(),
      ...(data.list && { list: data.list })
    };
  });
  
  // Find start step (node without incoming edges)
  const nodeIdsWithIncoming = new Set(edges.map(e => e.target));
  const startNode = nodes.find(n => !nodeIdsWithIncoming.has(n.id));
  
  return {
    id: workflowId,
    name: workflowName,
    description: workflowDescription,
    startStep: startNode?.id || (nodes[0]?.id || ""),
    createdAtUTC: new Date().toISOString(),
    updatedAtUTC: new Date().toISOString(),
    settings: {
      retryPolicy: "none",
      timeoutSeconds: "number"
    },
    steps
  };
};
