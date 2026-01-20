import { Dispatch, SetStateAction } from "react";
import { WorkflowNode } from "./configPanels";
import { Edge, Node } from "reactflow";

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  createdAtUTC?: string;
  updatedAtUTC?: string;
  isActive?: boolean;
}

export interface FlowEditorProps {
  onNodeAdded?: ({mainType, type, name}: {mainType: string; type: string; name: string}) => void;
  workflow: WorkflowJSON | null;
  nodes: any;
  setNodes: any;
  edges: any;
  setEdges: any;
  onEdgesChange: any;
  onNodesChange: any;
  setSelectedNode: any;
  selectedNode: any;
  setConfigPanelOpen: any;
  configPanelOpen: any;
  handleNodeClick: any;
  handleDeleteNode: any;
}

export interface CreateWorkflowDialogProps {
  open: boolean;
  mode: "create" | "update";
  isSubmitting: boolean;
  card?: {name: string, description: string}
  onSubmit: (onSubmit: () => void ) => void
  onOpenChange: (open: boolean) => void;
  onSuccess: (workflow: { name: string; description?: string }) => void;
}

export interface WorkflowTopBarProps {
  workflowId?: string;
  workflowName?: string;
}

export interface WorkflowCardProps {
  workflow: Workflow;
  onClick: () => void;
}

export interface WorkflowToolBarProps {
  workflowId?: string;
  workflowName?: string;
  isActive: boolean;
  nodes: Node[];
  setNodes: Dispatch<SetStateAction<Node[]>>;
  edges: Edge;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  setSelectedNode: Dispatch<SetStateAction<WorkflowNode | null>>;
  selectedNode: WorkflowNode | null;
  setConfigPanelOpen: Dispatch<SetStateAction<boolean>>;
  configPanelOpen: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  handleNodeClick: any;
  handleDeleteNode: any;
  workflow: any;
}

export interface WorkflowStep {
  id: string;
  workflowId?: string;
  name?: string;
  type: string;
  connections: Record<string, string>,
  createdAtUTC?: string;
  position: { x: number; y: number };
  nextStepId?: string;
  errorStepId?: string;
  outputVar?: string;
  parameters?: any;
  list?: any;
  Conditions?: any[];
}

export interface WorkflowJSON {
  id: string;
  name: string;
  description?: string;
  createdAtUTC?: string;
  updatedAtUTC?: string;
  startStep: string;
  settings?: Record<string, string>;
  steps: Record<string, WorkflowStep>;
}
