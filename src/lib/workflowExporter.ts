import { Node, Edge } from "reactflow";
import { WorkflowJSON } from "@/types/workflows";
import { WorkflowStep } from "@/types/workflows";
/**
 * Export React Flow nodes and edges back to WorkflowJSON format
 */
export const exportToWorkflowJSON = (
  nodes: Node[],
  edges: Edge[],
  workflowId: string,
  workflowName: string,
  workflowDescription?: string,
  createdAtUTC?: string,
  workflowSteps?: Record<string, string>
): WorkflowJSON => {
  const steps: Record<string, WorkflowStep> = workflowSteps || {};
  
  // Convert nodes to steps
  nodes.forEach((node) => {
    const { data } = node;

    // Build connections map from edges
    const connections: Record<string, string> = node.data.connections;
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
    settings: {
      retryPolicy: "none",
      timeoutSeconds: "number"
    },
    createdAtUTC,
    steps,
  };
};
