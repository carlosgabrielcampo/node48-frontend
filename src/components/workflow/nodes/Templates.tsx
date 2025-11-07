import { NodeType } from "@/types/workflow";
import { ForwardRefExoticComponent } from "react";
import { LucideProps, Power, Zap, Cog } from "lucide-react";

interface NodeTypeOption {
    mainType: NodeType;
    type: string,
    name: string;
    description: string;
    icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref">>
;
}

export const nodeTemplates: Record<string, NodeTypeOption>= {
  "html_input": {
    name: "HTML Input",
    description: "Make an HTML input",
    mainType: "trigger",
    type: "html_input",
    icon: Power
  },
  "http_request": {
    mainType: "trigger",
    type: "http_request",
    name: "HTTP Request",
    description: "Make an HTTP API call",
    icon: Power
  },
  "receive_email": {
    mainType: "trigger",
    type: "receive_email",
    name: "Receive Email",
    description: "Receive an email",
    icon: Power
  },
  "database_query": {
    mainType: "trigger",
    type: "database_query",
    name: "Database Query",
    description: "Execute a database query",
    icon: Power
  },
  "webhook_call": {
    mainType: "trigger",
    type: "webhook_call",
    name: "Webhook Trigger",
    description: "Trigger on webhook event",
    icon: Power
  },
  "send_email": {
    mainType: "action",
    type: "send_email",
    name: "Send Email",
    description: "Send an email notification",
    icon: Zap
  },
  "filter_array": {
    mainType: "operation",
    type: "filter_array",
    name: "Filter Data",
    description: "Filter array of items",
    icon: Cog
  },
  "transform_data": {
    mainType: "operation",
    type: "transform_data",
    name: "Transform Data",
    description: "Transform data structure",
    icon: Cog
  },
  "aggregate_value": {
    mainType: "operation",
    type: "aggregate_value",
    name: "Aggregate",
    description: "Aggregate multiple values",
    icon: Cog
  },
  "conditional_operation": {
    mainType: "operation",
    type: "conditional_operation",
    name: "Condition Node",
    description: "Advanced conditional logic with multiple rules",
    icon: Cog
  },
  "api_call": {
    mainType: "action",
    type: "api_call",
    name: "API Call",
    description: "Make external API requests with custom configuration",
    icon: Zap
  },
  "loop_operation": {
    mainType: "operation",
    type: "loop_operation",
    name: "Loop",
    description: "Iterate over data with format or create operations",
    icon: Cog
  },
  "read_csv":{
    mainType: "action",
    type: "read_csv",
    name: "Read CSV",
    description: "Read and parse CSV files",
    icon: Zap
  },
};
