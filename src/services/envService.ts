import { EnvProfile, UUID, WorkflowEnvMetadata } from "@/types/env";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY_PROJECT_ENVS = "lovable_project_envs";
const STORAGE_KEY_WORKFLOW_ENVS = "lovable_workflow_envs";
const STORAGE_KEY_ACTIVE_ENV = "lovable_active_env";

// Mock data for development
const defaultProjectEnvs: EnvProfile[] = [
  {
    id: "default-local",
    name: "Local",
    values: { API_URL: "http://localhost:3000", DEBUG: "true" },
    scope: "project",
    isDefault: true,
    createdAtUTC: new Date().toISOString(),
  },
  {
    id: "default-staging",
    name: "Staging",
    values: { API_URL: "https://staging.api.example.com", DEBUG: "false" },
    scope: "project",
    createdAtUTC: new Date().toISOString(),
  },
  {
    id: "default-production",
    name: "Production",
    values: { API_URL: "https://api.example.com", DEBUG: "false" },
    scope: "project",
    createdAtUTC: new Date().toISOString(),
  },
];

// Local storage helpers
const getFromStorage = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const response = await fetch(`http://localhost:4014/v1/envs/${key}`);
    const envs = await response.json();
    return envs ||[];
  } catch (error) {
    console.error(error)
    return defaultValue;
  }
};

const saveToStorage = async <T>(key: string, value: T): Promise<void> => {
  try {
    console.log({key, value})
    const response = await fetch(`http://localhost:4014/v1/envs/${key}`, { 
      method: "POST", 
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(value)
    });
    if(response.status === 201) console.log("Env saved")
    else console.error("Failed to save");
  } catch (e) {
    console.error("Failed to save");
  }
};

export const envService = {
  // Project-level env profiles
  getProjectEnvs: async (): Promise<EnvProfile[]> => {
    await new Promise((r) => setTimeout(r, 100));
    const envs = await getFromStorage<EnvProfile[]>(STORAGE_KEY_PROJECT_ENVS, []);
    if (envs.length === 0) {
      saveToStorage(STORAGE_KEY_PROJECT_ENVS, defaultProjectEnvs);
      return defaultProjectEnvs;
    }
    return envs;
  },

  createProjectEnv: async (data: Omit<EnvProfile, "id" | "scope" | "createdAtUTC">): Promise<EnvProfile> => {
    await new Promise((r) => setTimeout(r, 100));
    const envs = await envService.getProjectEnvs();
    const newEnv: EnvProfile = {
      ...data,
      id: uuidv4(),
      scope: "project",
      createdAtUTC: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEY_PROJECT_ENVS, [...envs, newEnv]);
    return newEnv;
  },

  updateProjectEnv: async (id: UUID, updates: Partial<EnvProfile>): Promise<EnvProfile | null> => {
    await new Promise((r) => setTimeout(r, 100));
    const envs = await envService.getProjectEnvs();
    const index = envs.findIndex((e) => e.id === id);
    if (index === -1) return null;
    
    envs[index] = { ...envs[index], ...updates, updatedAtUTC: new Date().toISOString() };
    saveToStorage(STORAGE_KEY_PROJECT_ENVS, envs);
    return envs[index];
  },

  deleteProjectEnv: async (id: UUID): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 100));
    const envs = await envService.getProjectEnvs();
    const filtered = envs.filter((e) => e.id !== id);
    saveToStorage(STORAGE_KEY_PROJECT_ENVS, filtered);
    return filtered.length < envs.length;
  },

  setProjectDefault: async (id: UUID): Promise<void> => {
    const envs = await envService.getProjectEnvs();
    const updated = envs.map((e) => ({ ...e, isDefault: e.id === id }));
    saveToStorage(STORAGE_KEY_PROJECT_ENVS, updated);
  },

  // Workflow-level env profiles
  getWorkflowEnvs: async (workflowId: UUID): Promise<WorkflowEnvMetadata> => {
    await new Promise((r) => setTimeout(r, 100));
    const allWorkflowEnvs = await getFromStorage<Record<UUID, WorkflowEnvMetadata>>(STORAGE_KEY_WORKFLOW_ENVS, {});
    return allWorkflowEnvs[workflowId] || { workflowId, envProfiles: [], activeEnvId: null };
  },

  createWorkflowEnv: async (workflowId: UUID, data: Omit<EnvProfile, "id" | "scope" | "workflowId" | "createdAtUTC">): Promise<EnvProfile> => {
    await new Promise((r) => setTimeout(r, 100));
    const allWorkflowEnvs = await getFromStorage<Record<UUID, WorkflowEnvMetadata>>(STORAGE_KEY_WORKFLOW_ENVS, {});
    const workflowMeta = allWorkflowEnvs[workflowId] || { workflowId, envProfiles: [], activeEnvId: null };
    
    const newEnv: EnvProfile = {
      ...data,
      id: uuidv4(),
      scope: "workflow",
      workflowId,
      createdAtUTC: new Date().toISOString(),
    };
    
    workflowMeta.envProfiles.push(newEnv);
    allWorkflowEnvs[workflowId] = workflowMeta;
    saveToStorage(STORAGE_KEY_WORKFLOW_ENVS, allWorkflowEnvs);
    return newEnv;
  },

  updateWorkflowEnv: async (workflowId: UUID, envId: UUID, updates: Partial<EnvProfile>): Promise<EnvProfile | null> => {
    await new Promise((r) => setTimeout(r, 100));
    const allWorkflowEnvs = await getFromStorage<Record<UUID, WorkflowEnvMetadata>>(STORAGE_KEY_WORKFLOW_ENVS, {});
    const workflowMeta = allWorkflowEnvs[workflowId];
    if (!workflowMeta) return null;
    
    const index = workflowMeta.envProfiles.findIndex((e) => e.id === envId);
    if (index === -1) return null;
    
    workflowMeta.envProfiles[index] = { ...workflowMeta.envProfiles[index], ...updates, updatedAtUTC: new Date().toISOString() };
    saveToStorage(STORAGE_KEY_WORKFLOW_ENVS, allWorkflowEnvs);
    return workflowMeta.envProfiles[index];
  },

  deleteWorkflowEnv: async (workflowId: UUID, envId: UUID): Promise<boolean> => {
    const allWorkflowEnvs = await getFromStorage<Record<UUID, WorkflowEnvMetadata>>(STORAGE_KEY_WORKFLOW_ENVS, {});
    const workflowMeta = allWorkflowEnvs[workflowId];
    if (!workflowMeta) return false;
    
    const prevLength = workflowMeta.envProfiles.length;
    workflowMeta.envProfiles = workflowMeta.envProfiles.filter((e) => e.id !== envId);
    saveToStorage(STORAGE_KEY_WORKFLOW_ENVS, allWorkflowEnvs);
    return workflowMeta.envProfiles.length < prevLength;
  },

  setWorkflowActiveEnv: async (workflowId: UUID, envId: UUID | null): Promise<void> => {
    const allWorkflowEnvs = await getFromStorage<Record<UUID, WorkflowEnvMetadata>>(STORAGE_KEY_WORKFLOW_ENVS, {});
    const workflowMeta = allWorkflowEnvs[workflowId] || { workflowId, envProfiles: [], activeEnvId: null };
    workflowMeta.activeEnvId = envId;
    allWorkflowEnvs[workflowId] = workflowMeta;
    saveToStorage(STORAGE_KEY_WORKFLOW_ENVS, allWorkflowEnvs);
  },

  // Global active environment (project-wide)
  getGlobalActiveEnv: async (): Promise<UUID | null> => {
    return await getFromStorage<UUID | null>(STORAGE_KEY_ACTIVE_ENV, null);
  },

  setGlobalActiveEnv: async (envId: UUID | null): Promise<void> => {
    saveToStorage(STORAGE_KEY_ACTIVE_ENV, envId);
  },

  // Import/Export
  exportProjectEnvs: async (): Promise<string> => {
    const envs = await envService.getProjectEnvs();
    return JSON.stringify(envs, null, 2);
  },

  importProjectEnvs: async (json: string): Promise<EnvProfile[]> => {
    try {
      const envs = JSON.parse(json) as EnvProfile[];
      const withNewIds = envs.map((e) => ({ ...e, id: uuidv4(), createdAtUTC: new Date().toISOString() }));
      const existingEnvs = await envService.getProjectEnvs();
      saveToStorage(STORAGE_KEY_PROJECT_ENVS, [...existingEnvs, ...withNewIds]);
      return withNewIds;
    } catch (e) {
      throw new Error("Invalid JSON format");
    }
  },
};
