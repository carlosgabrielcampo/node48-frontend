export type UUID = string;
export type ISODateString = string;

export interface Position {
  x: number;
  y: number;
}

export interface Workflow {
  id: UUID;
  name: string;
  description: string;
  startStep: UUID;
  settings: {
    retryPolicy: "none" | "simple" | "exponential";
    timeoutSeconds: number;
  };
  createdAtUTC: ISODateString;
  updatedAtUTC: ISODateString;
  steps: Record<UUID, WorkflowStep>;
}

export interface WorkflowStep {
  id: UUID;
  workflowId: UUID;
  type: NodeType;
  position: Position;
  parameters: StepParameters[];
  connections: Record<UUID, UUID | "">;
  list?: {
    timeoutMs: number;
    keys: string[];
  };
}

export type NodeType =
  | "schedule_trigger"
  | "send_email"
  | "code_node"
  | "set_values"
  | "database_write"
  | "ai_action"
  | "conditional_operation"
  | "api_call"
  | "loop_operation"
  | "read_csv";


export interface ScheduleTriggerParams {
  cronExpressions: string;
  nextStepId?: UUID;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
  nextStepId?: UUID;
}

export interface CodeNodeParams {
  language: "javascript" | "python";
  code: string;
  nextStepId?: UUID;
}

export interface SetValuesParams {
  values: Record<string, unknown>;
  nextStepId?: UUID;
}

export interface DatabaseWriteParams {
  connectionString: string;
  table: string;
  data: Record<string, unknown>;
  nextStepId?: UUID;
}

export interface AIActionParams {
  model: "gpt-4" | "gpt-3.5";
  prompt: string;
  nextStepId?: UUID;
}

export interface ConditionRule {
  field: string;
  type:
    | "equals"
    | "contains"
    | "regex"
    | "array_size_equals";
  validator: string | number;
}

export interface ConditionalOperationParams {
  condition: ConditionRule[];
  nextStepId: UUID;
}


export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

export type BodyType =
  | "none"
  | "raw"
  | "xxx-url-encoded"
  | "form-data";

export type ResponseFormat = "json" | "text";

export interface ApiCallParams {
  baseUrl: string;
  endpoint: string;
  method: HttpMethod;
  params: Record<string, string>;
  headers: Record<string, string>;
  body: Record<string, unknown> | string;
  bodyType: BodyType;
  responseFormat: ResponseFormat;
  outputVar: string;
  nextStepId?: UUID;
}

export interface LoopFormatField {
  field: string;
  type: string;
  convertionType?: string;
}

export type LoopType = "format" | "create" | "raw";

export interface LoopOperationParams {
  type: LoopType;
  sourceVar: string;
  outputVar: string;
  fields?: LoopFormatField[];
  limit?: number;
  offset?: number;
  nextStepId?: UUID;
}

export interface CsvParserConfig {
  escape: string;
  separator: string;
  strict: boolean;
}

export interface ReadCsvParams {
  filePath: string;
  encoding: string;
  chunkSize: number;
  errorPolicy: "skip" | "fail";
  outputVar: string;
  nullValues: string[];
  parser: CsvParserConfig;
  nextStepId?: UUID;
}

export type StepParameters =
  | ScheduleTriggerParams
  | SendEmailParams
  | CodeNodeParams
  | SetValuesParams
  | DatabaseWriteParams
  | AIActionParams
  | ConditionalOperationParams
  | ApiCallParams
  | LoopOperationParams
  | ReadCsvParams;

