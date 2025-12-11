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
  body: Record<string, string | null | number | boolean>;
  bodyType: "none" | "raw" | "xxx-url-encoded" | "form-data";
  reponseFormat: string;
  params?: Record<string, string>;
  nextStepId?: string;
  errorStepId?: string;
  outputVar?: string;
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
  type: "format" | "create" | "raw";
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
  type?: string;
  nullValues: string[];
  chunkSize: number;
  errorPolicy: string;
  parser: CsvParser;
  outputVar?: string;
  nextStepId?: string;
}

export interface WorkflowNode {
  id: string;
  name: string;
  workflowId?: string;
  createdAtUTC?: string;

  type: string,
  data: Record<string, any>
  
  // Config can be different types based on node type
  parameters?: ApiConfig[] | CsvConfig[] | LoopConfigEntry[] | ConditionBlock[];
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

// Config panel props - state is the parameters array
export interface LoopConfigPanelProps {
  state: LoopConfigEntry[];
  setState: (updates: LoopConfigEntry[]) => void;
}

export interface NodeConfigPanelProps {
  node: WorkflowNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (nodeId: string, updates: any[]) => void;
}

export interface CsvConfigPanelProps {
  state: CsvConfig[];
  setState: (updates: CsvConfig[]) => void;
}

export interface ConditionConfigPanelProps {
  state: ConditionBlock[];
  setState: (updates: ConditionBlock[]) => void;
}

export interface ApiConfigPanelProps {
  state: ApiConfig[];
  setState: (updates: ApiConfig[]) => void;
}
