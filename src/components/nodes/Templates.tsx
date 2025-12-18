import { ForwardRefExoticComponent } from "react";
import { LucideProps, Power, Zap, Cog, Network, RefreshCcw,  } from "lucide-react";

interface NodeTypeOption {
    type: string,
    name: string;
    description: string;
    icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref">>
    defaultPanelInfo: any;
}

export const nodeTemplates: Record<string, NodeTypeOption>= {
  "html_input": {
    name: "HTML Input",
    description: "Make an HTML input",
    type: "html_input",
    icon: Power,
    defaultPanelInfo: [{}]
  },
  "http_request": {
    type: "http_request",
    name: "HTTP Request",
    description: "Make an HTTP API call",
    icon: Power,
    defaultPanelInfo: [{}]
  },
  "receive_email": {
    type: "receive_email",
    name: "Receive Email",
    description: "Receive an email",
    icon: Power,
    defaultPanelInfo: [{}]
  },
  "database_query": {
    type: "database_query",
    name: "Database Query",
    description: "Execute a database query",
    icon: Power,
    defaultPanelInfo: [{}]
  },
  "webhook_call": {
    type: "webhook_call",
    name: "Webhook Trigger",
    description: "Trigger on webhook event",
    icon: Power,
    defaultPanelInfo: [{}]
  },
  "send_email": {
    type: "send_email",
    name: "Send Email",
    description: "Send an email notification",
    icon: Zap,
    defaultPanelInfo: [{}]
  },
  "filter_array": {
    type: "filter_array",
    name: "Filter Data",
    description: "Filter array of items",
    icon: Cog,
    defaultPanelInfo: [{}]
  },
  "transform_data": {
    type: "transform_data",
    name: "Transform Data",
    description: "Transform data structure",
    icon: Cog,
    defaultPanelInfo: [{}]
  },
  "aggregate_value": {
    type: "aggregate_value",
    name: "Aggregate",
    description: "Aggregate multiple values",
    icon: Cog,
    defaultPanelInfo: [{}]
  },
  "conditional_operation": {
    type: "conditional_operation",
    name: "Condition",
    description: "Advanced conditional logic with multiple rules",
    icon: Network,
    defaultPanelInfo: [{}]
  },
  "api_call": {
    type: "api_call",
    name: "API Call",
    description: "Make external API requests with custom configuration",
    icon: Zap,
    defaultPanelInfo: [
      {
        "baseUrl": "",
        "endpoint": "",
        "method": "GET",
        "params": {},
        "headers": {},
        "body": {},
        "bodyType": "none",
        "reponseFormat": "json",
        "nextStepId": "",
        "outputVar": ""
      }
    ]
  },
  "loop_operation": {
    type: "loop_operation",
    name: "Loop Operation",
    description: "Iterate over data with format or create operations",
    icon: RefreshCcw,
    defaultPanelInfo: [{}]
  },
  "read_csv":{
    type: "read_csv",
    name: "Read CSV",
    description: "Read and parse CSV files",
    icon: Zap,
    defaultPanelInfo: [{}]
  }
};
