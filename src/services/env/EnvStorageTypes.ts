type UUID = string;

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

export interface EnvStorageInterface {
  get<T>(key?: string, defaultValue?: {
    active: Record<string, string>[],
    profiles: Record<string, string>
  }): Promise<T>;
  save(options: {
    id: string;
    profiles?: EnvProfile[];
    active?: string[];
  }): Promise<void>;
  update(options: {
    id: string;
    profiles?: EnvProfile[];
    active?: string[];
  }): Promise<void>;
}