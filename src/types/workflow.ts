// Node types
export type NodeType = "action" | "operation" | "trigger" | "condition" | "api" | "loop" | "csv";

// Condition node types
export interface ConditionRule {
  field: string;
  type: string;
  validator: string;
}

export interface ConditionBlock {
  condition: ConditionRule[];
  nextStepId: string;
}

// API node types
export interface ApiConfig {
  baseUrl: string;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  body: Record<string, string>;
  reponseFormat: string;
}

// Loop node types
export interface LoopFormatField {
  field: string;
  type: string;
  convertionType: string;
}

export interface LoopConfigEntry {
  sourceVar: string;
  outputVar: string;
  type: "format" | "create";
  nextStepId: string;
  fields?: LoopFormatField[];
  limit?: number;
  offset?: number;
}

// CSV node types
export interface CsvParser {
  escape: string;
  strict: boolean;
  separator: string;
}

export interface CsvConfig {
  filePath: string;
  encoding: string;
  type: string;
  nullValues: string[];
  chunkSize: number;
  errorPolicy: string;
  parser: CsvParser;
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  name: string;
  position: { x: number; y: number };
  workflowId?: string;
  createdAtUTC?: string;
  nextStepId?: string;
  errorStepId?: string;
  outputVar?: string;
  
  // Condition node
  Conditions?: ConditionBlock[];
  
  // API node
  config?: ApiConfig | CsvConfig | LoopConfigEntry[];
  list?: {
    timeoutMs: number;
    keys: string[];
  };
  
  // Legacy/display
  onDelete?: (id: string) => void;
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
