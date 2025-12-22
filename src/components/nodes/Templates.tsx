import { ForwardRefExoticComponent } from "react";
import { LucideProps, Power, Zap, Cog, Network, RefreshCcw,  } from "lucide-react";

interface NodeTypeOption {
    type: string,
    name: string;
    description: string;
    icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref">>
    panelInfo: any;
    panelFormat: any;
}

export const nodeTemplates: Record<string, NodeTypeOption>= {
  "html_input": {
    name: "HTML Input",
    description: "Make an HTML input",
    type: "html_input",
    icon: Power,
    panelInfo: [{}],
    panelFormat: {}
  },
  "http_request": {
    type: "http_request",
    name: "HTTP Request",
    description: "Make an HTTP API call",
    icon: Power,
    panelInfo: [{}],
    panelFormat: {}
  },
  "receive_email": {
    type: "receive_email",
    name: "Receive Email",
    description: "Receive an email",
    icon: Power,
    panelInfo: [{}],
    panelFormat: {}
  },
  "database_query": {
    type: "database_query",
    name: "Database Query",
    description: "Execute a database query",
    icon: Power,
    panelInfo: [{}],
    panelFormat: {}
  },
  "webhook_call": {
    type: "webhook_call",
    name: "Webhook Trigger",
    description: "Trigger on webhook event",
    icon: Power,
    panelInfo: [{}],
    panelFormat: {}
  },
  "send_email": {
    type: "send_email",
    name: "Send Email",
    description: "Send an email notification",
    icon: Zap,
    panelInfo: [{}],
    panelFormat: {}
  },
  "filter_array": {
    type: "filter_array",
    name: "Filter Data",
    description: "Filter array of items",
    icon: Cog,
    panelInfo: [{}],
    panelFormat: {}
  },
  "transform_data": {
    type: "transform_data",
    name: "Transform Data",
    description: "Transform data structure",
    icon: Cog,
    panelInfo: [{}],
    panelFormat: {}
  },
  "aggregate_value": {
    type: "aggregate_value",
    name: "Aggregate",
    description: "Aggregate multiple values",
    icon: Cog,
    panelInfo: [{}],
    panelFormat: {}
  },
  "conditional_operation": {
    type: "conditional_operation",
    name: "Condition",
    description: "Advanced conditional logic with multiple rules",
    icon: Network,
    panelInfo: [{}],
    panelFormat: {}
  },
  "api_call": {
    type: "api_call",
    name: "API Call",
    description: "Make external API requests with custom configuration",
    icon: Zap,
    panelInfo: {
        "baseUrl": "",
        "endpoint": "",
        "method": "GET",
        "params": {},
        "headers": {},
        "body": {},
        "bodyType": "none",
        "responseFormat": "json",
        "nextStepId": "",
        "outputVar": ""
      }
    ,
    panelFormat: {
        "component": "LabeledCard",
        "label": "API Configuration",
        "format": "single",
        "type": "container",
        "header": [{
          "component": "AddOptions",
          "label": "Add Config",
          "bind": "headers"
        },{
          "component": "DeleteButton",
          "bind": "headers"
        }],
        "children": [
          {
            "component": "LabeledInput",
            "label": "Base URL",
            "bind": "baseUrl",
            "placeholder": "http://localhost:3009",
            "type": "input",
            "valueType": "string"
          },
          {
            "component": "LabeledInput",
            "label": "Endpoint",
            "bind": "endpoint",
            "placeholder": "/api/webhook/status",
            "type": "input",
            "valueType": "string"
          },
          {
            "component": "LabeledDropdown",
            "label": "Method",
            "bind": "method",
            "type": "select",
            "options": [
              { itemProperties: {value: "GET" }, display: "GET" },
              { itemProperties: {value: "POST" }, display: "POST" },
              { itemProperties: {value: "PUT" }, display: "PUT" },
              { itemProperties: {value: "PATCH" }, display: "PATCH" },
              { itemProperties: {value: "DELETE" }, display: "DELETE" },
            ]
          },
          {
            "component": "LabeledDropdown",
            "label": "Response Format",
            "bind": "responseFormat",
            "type": "select",
            "options": [
              {itemProperties: {value: "json"}, display: "JSON"},
              {itemProperties: {value: "text"}, display: "TEXT"},
            ]
          },
          {
            "component": "LabeledInput",
            "label": "OutputVar",
            "bind": "outputVar",
            "placeholder": "apiAuthorized",
            "type": "input",
            "valueType": "string"
          },
          {
            "component": "LabeledCard",
            "label": "Params",
            "type": "keyValueList",
            "actions": ["add", "remove"],
            "children": [{
              "component": "KeyValueList",
              "bind": "params",
              "Key": { "component": "input", "placeholder": "Key" },
              "Value": { "component": "input", "placeholder": "Value" }
            }]
          },
          {
            "component": "LabeledCard",
            "label": "Headers",
            "actions": ["add", "remove"],
            "children": [{
              "component": "KeyValueList",
              "bind": "headers",
              "itemSchema": {
                "Key": { "component": "input", "placeholder": "Key" },
                "Value": { "component": "input", "placeholder": "Value" }
              }
            }]
          },
          {
            "component": "LabeledCard",
            "label": "Body",
            "bind": "bodyType",
            "header": [{
              "component": "LabeledDropdown",
              "bind": "bodyType",
              "options": [
                {itemProperties: {value: "none"}, display: "none"},
                {itemProperties: {value: "raw"}, display: "raw"},
                {itemProperties: {value: "xxx-url-encoded"}, display: "xxx-url-encoded"},
                {itemProperties: {value: "form-data"}, display: "form-data"},
              ]
            }],
            "children": [{
              "component": "SwitchableChildren",
              "bind": "bodyType",
              "switch": [{
                  "key": "none",
                  "component": "empty",
                  "bind": "body"
                },{ 
                  "key": "raw",
                  "component": "CodeTextarea",
                  "language": "json",
                  "bind": "body"
                },{ 
                  "key": "xxx-url-encoded",
                  "component": "KeyValueList",
                  "bind": "body",
                  "itemSchema": {
                    "Key": { "component": "input" },
                    "Value": { "component": "input" }
                  }
                },{ 
                  "key": "form-data",
                  "component": "KeyValueList",
                  "bind": "body",
                  "itemSchema": {
                    "Key": { "component": "input" },
                    "Value": { "component": "input" }
                  }
                },
              ]
            }]
          }
        ]
    }
  },
  "loop_operation": {
    type: "loop_operation",
    name: "Loop Operation",
    description: "Iterate over data with format or create operations",
    icon: RefreshCcw,
    panelInfo: [{}],
    panelFormat: {}
  },
  "read_csv":{
    type: "read_csv",
    name: "Read CSV",
    description: "Read and parse CSV files",
    icon: Zap,
    panelInfo: [{}],
    panelFormat: {}
  }
};
