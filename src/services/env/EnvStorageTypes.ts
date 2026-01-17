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
  isActive?: boolean
}

export interface EnvStorageInterface {
  get(key?: string, defaultValue?: any): Promise<any>;
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
  deleteProfile(
    env: string,
    profileId: string
  ): Promise<void>;
  setDefault(
    env: string,
    profileId: string
  ): Promise<void>;
  setActive(
    id: UUID, 
    envId: UUID | null, 
    type: "workflow" | "global"
  ): Promise<void>;
  removeActive(
    id: UUID, 
    envId: UUID | null, 
    type: "workflow" | "global"
  ): Promise<void>;
}
