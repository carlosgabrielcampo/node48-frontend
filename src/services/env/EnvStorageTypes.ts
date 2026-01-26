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
  get(key?: string): Promise<void>;
  save(options: {
    id: string;
    profiles?: EnvProfile[];
  }): Promise<void>;
  update(options: {
    id: string;
    profiles?: EnvProfile;
    active?: string[];
  }): Promise<void>;
  deleteProfile(
    id: string,
    profileId: string
  ): Promise<void>;
  setDefault(
    id: string,
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
