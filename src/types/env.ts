export type UUID = string;

export interface EnvValues { 
  [key: string]: string;
}

export interface EnvProfile {
  id: UUID;
  name: string;
  values: EnvValues;
  createdAtUTC?: string;
  updatedAtUTC?: string;
  scope: "project" | "workflow";
  workflowId?: UUID;
  isDefault?: boolean;
}

export interface EnvDiff {
  key: string;
  projectValue?: string;
  workflowOverride?: string;
  resolvedValue: string;
  source: "project" | "workflow";
}

export interface WorkflowEnvMetadata {
  workflowId: UUID;
  activeEnvId?: UUID | null;
  envProfiles: EnvProfile[];
}
