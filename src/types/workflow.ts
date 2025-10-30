// Node types
export type NodeType = "action" | "operation";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  position: { x: number; y: number };
}

// Connection types
export interface WorkflowConnection {
  id: string;
  source: {
    nodeId: string;
    outputIndex: number;
  };
  target: {
    nodeId: string;
    inputIndex: number;
  };
}

// Serialized workflow
export interface WorkflowData {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}
