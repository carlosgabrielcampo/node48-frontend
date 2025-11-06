import { NodeType } from "@/types/workflow";

interface NodeTypeOption {
    mainType: NodeType;
    type: string,
    name: string;
    description: string;
}

export const nodeTemplates: Record<string, NodeTypeOption>= {
  "html_input": {
    name: "HTML Input",
    description: "Make an HTML input",
    mainType: "trigger",
    type: "html_input",
  },
  "http_request": {
    mainType: "trigger",
    type: "http_request",
    name: "HTTP Request",
    description: "Make an HTTP API call",
  },
  "receive_email": {
    mainType: "trigger",
    type: "receive_email",
    name: "Receive Email",
    description: "Receive an email",
  },
  "database_query": {
    mainType: "trigger",
    type: "database_query",
    name: "Database Query",
    description: "Execute a database query",
  },
  "webhook_call": {
    mainType: "trigger",
    type: "webhook_call",
    name: "Webhook Trigger",
    description: "Trigger on webhook event",
  },
  "send_email": {
    mainType: "action",
    type: "send_email",
    name: "Send Email",
    description: "Send an email notification",
  },
  "filter_array": {
    mainType: "operation",
    type: "filter_array",
    name: "Filter Data",
    description: "Filter array of items"
  },
  "transform_data": {
    mainType: "operation",
    type: "transform_data",
    name: "Transform Data",
    description: "Transform data structure",
  },
  "aggregate_value": {
    mainType: "operation",
    type: "aggregate_value",
    name: "Aggregate",
    description: "Aggregate multiple values",
  },
  "conditional_operation": {
    mainType: "operation",
    type: "conditional_operation",
    name: "Condition Node",
    description: "Advanced conditional logic with multiple rules",
  },
  "api_call": {
    mainType: "action",
    type: "api_call",
    name: "API Call",
    description: "Make external API requests with custom configuration",
  },
  "loop_operation": {
    mainType: "operation",
    type: "loop_operation",
    name: "Loop",
    description: "Iterate over data with format or create operations",
  },
  "read_csv":{
    mainType: "action",
    type: "read_csv",
    name: "Read CSV",
    description: "Read and parse CSV files",
  },
};
