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
    profileName: string
  ): Promise<void>;
  setDefault(
    env: string,
    profileName: string
  ): Promise<void>;
}
