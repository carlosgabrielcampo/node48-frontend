import { Dispatch, SetStateAction } from "react";
import { WorkflowNode } from "./configPanels";
import { Edge, Node, NodeChange, EdgeChange } from "reactflow";
import { NodeType, Position, StepParameters, ISODateString } from "./parameters";
type OnChange<ChangesType> = (changes: ChangesType[]) => void;
export type UUID = string;


export interface WorkflowJSON {
  id: UUID;
  name: string;
  description: string;
  startStep: UUID;
  settings: {
    retryPolicy: "none" | "simple" | "exponential";
    timeoutSeconds: number;
  };
  createdAtUTC: ISODateString;
  updatedAtUTC: ISODateString;
  steps: Record<UUID, WorkflowStep>;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  createdAtUTC?: string;
  updatedAtUTC?: string;
  isActive?: boolean;
}

export interface NodeAdded {
  mainType: string;
  type: string;
  name: string
}

export interface FlowEditorProps {
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node;
  configPanelOpen: boolean;
  workflow: WorkflowJSON | null;
  onEdgesChange: OnChange<EdgeChange>;
  onNodesChange: OnChange<NodeChange>;
  setNodes: Dispatch<SetStateAction<Node[]>>;
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  handleDeleteNode: (nodeId: string) => void;
  handleNodeClick: (node: WorkflowNode) => void;
  setSelectedNode: Dispatch<SetStateAction<Node>>;
  setConfigPanelOpen: Dispatch<SetStateAction<boolean>>;
  onNodeAdded?: ({mainType, type, name}: NodeAdded) => void;
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
  handleNodeClick: (node: WorkflowNode) => void;
  handleDeleteNode: (nodeId: string) => void;
  workflow: WorkflowJSON | null;
}


export interface WorkflowStep {
  id: UUID;
  workflowId: UUID;
  type: NodeType;
  position: Position;
  parameters: StepParameters[];
  connections: Record<UUID, UUID | "">;
  list?: {
    timeoutMs: number;
    keys: string[];
  };
}