import { WorkflowJSON } from "@/lib/workflowParser";
import { Workflow } from "@/services/workflowService";
import { Dispatch, SetStateAction } from "react";
export interface FlowEditorProps {
  onNodeAdded?: ({mainType, type, name}) => void;
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
  nodes: any;
  setNodes: any;
  edges: any;
  setEdges: any;
  setSelectedNode: any;
  selectedNode: any;
  setConfigPanelOpen: any;
  configPanelOpen: any;
  setWorkflowId: (id: string) => void;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  handleNodeClick: any;
  handleDeleteNode: any;
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
  config?: any;
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
  settings?: any;
  steps: Record<string, WorkflowStep>;
}