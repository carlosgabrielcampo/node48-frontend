export type { WorkflowNode } from "./configPanels";

export interface NodeConfigPanelProps {
  node: import("./configPanels").WorkflowNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (nodeId: string, updates: any[], connections: any) => void;
  setEdges: (v: any) => void;
}
