import { ForwardRefExoticComponent } from "react";
import { LucideProps, Zap, Cog, Network, FileSpreadsheet, Repeat, Timer, Mail, Code, RectangleEllipsis, DatabaseZap, Bot } from "lucide-react";

interface NodeTypeOption {
    type: string,
    name: string;
    description: string;
    icon?: ForwardRefExoticComponent<Omit<LucideProps, "ref">>
    panelInfo: any;
    panelFormat: any;
}

export const nodeTemplates: Record<string, NodeTypeOption>= {
  "schedule_trigger": {
    "type": "schedule_trigger",
    "name": "Schedule Trigger",
    "description": "Trigger workflow on a schedule.",
    "icon": Timer,
    "panelInfo": {
      "cronExpressions": ""
    },
    "panelFormat": {
      "title": "Schedule Trigger",
      "header": [{
        "component": "AddButton",
        "label": "New Rule",
        "type": "new_default",
        "bind": "condition"
      }],
      "children": [{
          component: "LabeledCard",
          label: "Cron Expression",
          header: [{
            component: "DeleteButton",
            "type": "delete",
          }],
          children: [
            {
              component: "LabeledInput",
              bind: "cronExpressions",
              valueType: "string",
              placeholder: "0 9 * * *"
            }
          ]
        }]
    }
  },
  "send_email": {
    "type": "send_email",
    "name": "Send Email",
    "description": "Send email via SMTP.",
    "icon": Mail,
    "panelInfo": {
      "to": "",
      "subject": "",
      "body": ""
    },
    "panelFormat": {
      "title": "Send Email",
      "children": [
        {
          "component": "LabeledInput",
          "label": "To",
          "bind": "to"
        },
        {
          "component": "LabeledInput",
          "label": "Subject",
          "bind": "subject"
        },
        {
          "component": "LabeledTextArea",
          "label": "Body",
          "bind": "body"
        }
      ]
    }
  },
  "code_node": {
    "type": "code_node",
    "name": "Code",
    "description": "Run custom JavaScript.",
    "icon": Code,
    "panelInfo": {
      "language": "javascript",
      "code": ""
    },
    "panelFormat": {
      "title": "Code Script",
      "children": [
        {
          "component": "LabeledDropdown",
          "label": "Language",
          "bind": "language",
          "options": [
            { "itemProperties": { "value": "javascript" }, "display": "JavaScript" },
            { "itemProperties": { "value": "python" }, "display": "Python" }
          ]
        },
        {
          "component": "CodeTextarea",
          "label": "Script",
          "bind": "code"
        }
      ]
    }
  },
  "set_values": {
    "type": "set_values",
    "name": "Set Values",
    "description": "Set data fields.",
    "icon": RectangleEllipsis,
    "panelInfo": {
      "values": {}
    },
    "panelFormat": {
      "title": "Set Data Values",
      "children": [
        {
          "component": "KeyValueList",
          "bind": "values"
        }
      ]
    }
  },
  "database_write": {
    "type": "database_write",
    "name": "Database Write",
    "description": "Write data to a database.",
    "icon": DatabaseZap,
    "panelInfo": {
      "connectionString": "",
      "table": "",
      "data": {}
    },
    "panelFormat": {
      "title": "Database Write",
      "children": [
        {
          "component": "LabeledInput",
          "label": "Connection String",
          "bind": "connectionString"
        },
        {
          "component": "LabeledInput",
          "label": "Table Name",
          "bind": "table"
        },
        {
          "component": "KeyValueList",
          "bind": "data"
        }
      ]
    }
  },
  "ai_action": {
    "type": "ai_action",
    "name": "AI Action",
    "description": "Send a prompt to an AI model.",
    "icon": Bot,
    "panelInfo": {
      "model": "gpt-4",
      "prompt": ""
    },
    "panelFormat": {
      "title": "AI Action",
      "children": [
        {
          "component": "LabeledDropdown",
          "label": "Model",
          "bind": "model",
          "options": [
            { "itemProperties": { "value": "gpt-4" }, "display": "GPT-4" },
            { "itemProperties": { "value": "gpt-3.5" }, "display": "GPT-3.5" }
          ]
        },
        {
          "component": "CodeTextarea",
          "label": "Prompt",
          "bind": "prompt"
        }
      ]
    }
  },
  "conditional_operation": {
    type: "conditional_operation",
    name: "Condition",
    description: "Advanced conditional logic with multiple rules",
    icon: Network,
    panelInfo: {
      "condition": [
          {
              "field": "",
              "type": "equals",
              "validator": ""
          }
      ],
    },
    panelFormat: {
      "title": "Set Conditions",
      "header": [{
        "component": "AddButton",
        "label": "New Condition",
        "type": "new_default",
      }],
      children: [
        {
          component: "LabeledCard",
          label: "Condition",
          "header": [{
            "component": "AddButton",
            "label": "New Rule",
            "type": "new_array",
            "bind": "condition"
          },{
            "component": "DeleteButton",
            "type": "delete",
          }],
          children: [{
            bind: "condition",
            format: "array",
            children: [{
              label: "Rule",
              component: "LabeledCard",
              bind: "condition",
              header: [{
                component: "DeleteButton",
                "type": "delete",
              }],
              children: [
                {
                  component: "LabeledInput",
                  label: "Field",
                  bind: "field",
                  placeholder: "{{csvAutorizados.DT_NASC}}",
                  valueType: "string"
                },
                {
                  component: "LabeledDropdown",
                  label: "Type",
                  bind: "type",
                  options: [
                    { itemProperties: { value: "regex" }, display: "Regex" },
                    { itemProperties: { value: "equals" }, display: "Equals" },
                    { itemProperties: { value: "contains" }, display: "Contains" }
                  ]
                },
                {
                  component: "LabeledInput",
                  label: "Validator",
                  bind: "validator",
                  placeholder: "/10/",
                  valueType: "string"
                }
              ]
            }, 
          ]
          }]
        }
      ]
    }
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
    },
    panelFormat: {
        "title": "API Configuration",
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
                  "bind": "body",
                  "parent": "api_call"
                },{ 
                  "key": "raw",
                  "component": "CodeTextarea",
                  "language": "json",
                  "bind": "body",
                  "parent": "api_call"
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
    icon: Repeat,
    panelInfo: {
      "type": "raw",
      "sourceVar": "",
      "outputVar": "",
    },
    panelFormat: {
      title: "Loop Configuration",
      header: [
        {
          component: "AddButton",
          label: "Add Config",
          type: "new_default"
        }
      ],
      children: [
        {
          component: "LabeledCard",
          label: "Config",
          header: [
            {
              component: "DeleteButton",
              type: "delete"
            }
          ],
          children: [
            {
              component: "LabeledInput",
              label: "Source Variable",
              bind: "sourceVar",
              placeholder: "{{Autorizados}}",
              valueType: "string"
            },
            {
              component: "LabeledInput",
              label: "Output Variable",
              bind: "outputVar",
              placeholder: "csvAutorizados",
              valueType: "string"
            },
            {
              component: "LabeledDropdown",
              label: "Type",
              bind: "type",
              options: [
                { itemProperties: { value: "format" }, display: "Format" },
                { itemProperties: { value: "create" }, display: "Create" },
                { itemProperties: { value: "raw" }, display: "Raw" }
              ]
            },
            {
              component: "SwitchableChildren",
              bind: "type",
              switch: [
                {
                  key: "format",
                  component: "LabeledCard",
                  label: "Fields",
                  header: [
                    {
                      component: "AddButton",
                      label: "Add Field",
                      type: "new_array",
                      bind: "fields"
                    }
                  ],
                  children: [
                    {
                      bind: "fields",
                      format: "array",
                      children: [
                        {
                          component: "LabeledCard",
                          label: "Field",
                          bind: "fields",
                          header: [
                            {
                              component: "DeleteButton",
                              type: "delete"
                            }
                          ],
                          children: [
                            {
                              component: "LabeledInput",
                              label: "Field",
                              bind: "field",
                              placeholder: "{{Autorizados.DT_NASC}}",
                              valueType: "string"
                            },
                            {
                              component: "LabeledInput",
                              label: "Type",
                              bind: "type",
                              placeholder: "convert",
                              valueType: "string"
                            },
                            {
                              component: "LabeledInput",
                              label: "Conversion Type",
                              bind: "convertionType",
                              placeholder: "brDateFormatToDate",
                              valueType: "string"
                            }
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  key: "create",
                  component: "LabeledCard",
                  label: "Create Options",
                  children: [
                    {
                      component: "LabeledInput",
                      label: "Limit",
                      bind: "limit",
                      valueType: "number"
                    },
                    {
                      component: "LabeledInput",
                      label: "Offset",
                      bind: "offset",
                      valueType: "number"
                    }
                  ]
                },
                {
                  key: "raw",
                  component: "empty"
                }
              ]
            }
          ]
        }
      ]
    }
  },
  "read_csv":{
    type: "read_csv",
    name: "Read CSV",
    description: "Read and parse CSV files",
    icon: FileSpreadsheet,
    panelInfo: {
      filePath: "",
      encoding: "utf-8",
      chunkSize: 200,
      errorPolicy: "skip",
      outputVar: "",
      nullValues: [],
      parser: {
        escape: "'",
        separator: ";",
        strict: false
      }
    },
    panelFormat: {
      title: "CSV Configuration",
      children: [
        {
          component: "LabeledInput",
          label: "File Path",
          bind: "filePath",
          placeholder: "_test/mock/database/Autorizados.csv",
          valueType: "string"
        },
        {
          component: "LabeledInput",
          label: "Encoding",
          bind: "encoding",
          placeholder: "utf-8",
          valueType: "string"
        },
        {
          component: "LabeledInput",
          label: "Chunk Size",
          bind: "chunkSize",
          valueType: "number"
        },
        {
          component: "LabeledInput",
          label: "Error Policy",
          bind: "errorPolicy",
          placeholder: "skip",
          valueType: "string"
        },
        {
          component: "LabeledInput",
          label: "Output Variable",
          bind: "outputVar",
          placeholder: "Autorizados",
          valueType: "string"
        },
        {
          component: "LabeledCard",
          label: "Null Values",
          header: [
            {
              component: "AddButton",
              label: "Add",
              type: "new_array",
              bind: "nullValues"
            }
          ],
          children: [
            {
              component: "LabeledArrayInput",
              bind: "nullValues",
              valueType: "string"
            }
          ]
        },
        {
          component: "LabeledCard",
          label: "Parser Settings",
          format: "object",
          bind: "parser",
          children: [
            {
              component: "LabeledInput",
              label: "Escape Character",
              bind: "escape",
              placeholder: "'",
              valueType: "string"
            },
            {
              component: "LabeledInput",
              label: "Separator",
              bind: "separator",
              placeholder: ";",
              valueType: "string"
            },
            {
              component: "LabeledCheckbox",
              label: "Strict Mode",
              bind: "strict",
              valueType: "boolean"
            }
          ]
        }
      ]
    }
  }
};
