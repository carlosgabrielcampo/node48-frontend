import { NodeType } from "@/types/config-panels";
import { ForwardRefExoticComponent } from "react";
import { LucideProps, Power, Zap, Cog, Network } from "lucide-react";

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
    mainType: "custom",
    type: "html_input",
    icon: Power,
    connections: {}
  },
  "http_request": {
    mainType: "custom",
    type: "http_request",
    name: "HTTP Request",
    description: "Make an HTTP API call",
    icon: Power,
    connections: {}
  },
  "receive_email": {
    mainType: "custom",
    type: "receive_email",
    name: "Receive Email",
    description: "Receive an email",
    icon: Power,
    connections: {}
  },
  "database_query": {
    mainType: "custom",
    type: "database_query",
    name: "Database Query",
    description: "Execute a database query",
    icon: Power,
    connections: {}
  },
  "webhook_call": {
    mainType: "custom",
    type: "webhook_call",
    name: "Webhook Trigger",
    description: "Trigger on webhook event",
    icon: Power,
    connections: {}
  },
  "send_email": {
    mainType: "custom",
    type: "send_email",
    name: "Send Email",
    description: "Send an email notification",
    icon: Zap,
    connections: {}
  },
  "filter_array": {
    mainType: "custom",
    type: "filter_array",
    name: "Filter Data",
    description: "Filter array of items",
    icon: Cog,
    connections: {}
  },
  "transform_data": {
    mainType: "custom",
    type: "transform_data",
    name: "Transform Data",
    description: "Transform data structure",
    icon: Cog,
    connections: {}
  },
  "aggregate_value": {
    mainType: "custom",
    type: "aggregate_value",
    name: "Aggregate",
    description: "Aggregate multiple values",
    icon: Cog,
    connections: {}
  },
  "conditional_operation": {
    mainType: "custom",
    type: "conditional_operation",
    name: "Condition",
    description: "Advanced conditional logic with multiple rules",
    icon: Network,
    connections: {}
  },
  "api_call": {
    mainType: "custom",
    type: "api_call",
    name: "API Call",
    description: "Make external API requests with custom configuration",
    icon: Zap,
    connections: {}
  },
  "loop_operation": {
    mainType: "custom",
    type: "loop_operation",
    name: "Loop",
    description: "Iterate over data with format or create operations",
    icon: Cog,
    connections: {}
  },
  "read_csv":{
    mainType: "custom",
    type: "read_csv",
    name: "Read CSV",
    description: "Read and parse CSV files",
    icon: Zap,
    connections: {}
  },
};
