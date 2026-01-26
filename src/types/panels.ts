export type { WorkflowNode } from "./configPanels";
import { Edge } from "reactflow";
import { WorkflowConnection } from "./configPanels";
import { StepParameters } from "./parameters";
export interface NodeConfigPanelProps {
  node: import("./configPanels").WorkflowNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (nodeId: string, parameters: StepParameters[], connections: WorkflowConnection) => void;
  setEdges: (v: Edge) => void;
}


export type ValueType = "string" | "number" | "boolean";

export interface DropdownOption {
  itemProperties: {
    value: string;
  };
  display: string;
}

export interface BasePanelComponent {
  component: string;
  children?: PanelComponent[];
  format?: string;
  label?: string;
  bind?: string;
  valueType?: ValueType;
  placeholder?: string;
  type?: string;
}

export interface LabeledInput extends BasePanelComponent {
  component: "LabeledInput";
}

export interface LabeledTextArea extends BasePanelComponent {
  component: "LabeledTextArea";
}

export interface CodeTextarea extends BasePanelComponent {
  component: "CodeTextarea";
  language?: string;
}

export interface LabeledCheckbox extends BasePanelComponent {
  component: "LabeledCheckbox";
}

export interface LabeledDropdown extends BasePanelComponent {
  component: "LabeledDropdown";
  options: DropdownOption[];
}

export interface AddButton {
  component: "AddButton";
  label: string;
  type: "new_default" | "new_array";
  bind?: string;
}

export interface DeleteButton {
  component: "DeleteButton";
  type: "delete";
}

export interface LabeledCard extends BasePanelComponent {
  component: "LabeledCard";
  header?: PanelHeaderItem[];
  children?: PanelComponent[];
  format?: "array" | "object";
}

export interface KeyValueList extends BasePanelComponent {
  component: "KeyValueList";
  itemSchema?: Record<string, BasePanelComponent>;
}

export interface SwitchableChildren extends BasePanelComponent {
  component: "SwitchableChildren";
  switch: {
    key: string;
    component: string;
    bind?: string;
    parent?: string;
    language?: string;
    itemSchema?: Record<string, BasePanelComponent>;
  }[];
}

export type PanelHeaderItem = AddButton | DeleteButton;

export type PanelComponent =
  | LabeledInput
  | LabeledTextArea
  | CodeTextarea
  | LabeledCheckbox
  | LabeledDropdown
  | LabeledCard
  | KeyValueList
  | SwitchableChildren;


export interface PanelFormat {
  title: string;
  header?: PanelHeaderItem[];
  children?: PanelComponent[];
}


export type PanelInfo =
  | Record<string, string | number | boolean | object>;