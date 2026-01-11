import { EnvProfile } from "@/types/env";
import { v4 as uuidv4 } from "uuid";
import { RemoteEnvStorage } from "./RemoteEnvStorage";
import { LocalEnvStorage } from "./LocalEnvStorage";
import { EnvStorageInterface } from "./EnvStorageTypes";

const STORAGE_KEY_GLOBAL_ENVS = "global";
const isProd = import.meta.env.PROD;

export const envStorageService: EnvStorageInterface = new LocalEnvStorage()
  // ? new RemoteEnvStorage()
  // : new LocalEnvStorage();

export const envService = {
  get: async () => {
    return await envStorageService.get();
  },
  getById: async ({id}: {id: string}): Promise<any> => {
    return await envStorageService.get(id, {profiles: {}, active: []});
  },
  getProfiles: async ({id}: {id: string}) => {
    return (await envService.getById({id}))["profiles"];
  },
  getActive: async ({id}: {id: string}) => {
    return (await envService.getById({id}))["active"];
  },
  create: async ({id, profiles}: {id: string; profiles: any[]}): Promise<void> => {
    return await envStorageService.save({id, profiles: profiles});
  },
  updateProfiles: async ({id, profileName, updates}: {id: string; profileName: string; updates: any}): Promise<any> => {
    const existingEnv = await envService.getProfiles({id});
    if (existingEnv[profileName]) {
      existingEnv[profileName].values = updates.values;
    }
    await envStorageService.update({id, profiles: Object.values(existingEnv)});
    return existingEnv;
  },
  delete: async (id: string): Promise<void> => {
    await new Promise((r) => setTimeout(r, 100));
    // Implementation depends on storage backend
  },
  setDefault: async (): Promise<void> => {
    // Implementation depends on storage backend
  },
  setActiveEnv: async ({id, envId}: {id: string; envId: string | null}): Promise<void> => {
    const workflowEnv = await envService.getById({id});
    const activeEnv = (workflowEnv.active || []).filter((e: any) => e?.scope !== "workflow");
    const saved = envId 
      ? await envStorageService.update({id, active: [...activeEnv, envId]})
      : await envStorageService.update({id, active: [...activeEnv]});
  },
  setWorkflowActiveGlobalEnv: async ({id, envId}: {id: string; envId: string | null}): Promise<void> => {
    const get = await envService.getById({id: "global"});
    const workflowEnv = await envService.getById({id});
    const activeEnv = (workflowEnv?.active || []).filter((e: any) => e?.scope !== "global");
  
    if (envId && get.profiles[envId]) {
      await envStorageService.update({id, active: [...activeEnv, get.profiles[envId]]});
    } else {
      await envStorageService.update({id, active: [...activeEnv]});
    }
  },
  export: async (): Promise<string> => {
    const envs = await envService.getById({id: STORAGE_KEY_GLOBAL_ENVS});
    return JSON.stringify(envs.profiles, null, 2);
  },
  import: async (json: string): Promise<EnvProfile[]> => {
    try {
      const envs = JSON.parse(json) as Record<string, EnvProfile>;
      const withNewIds = Object.values(envs).map((e) => ({ ...e, id: uuidv4(), createdAtUTC: new Date().toISOString() }));
      const existingEnvs = await envService.getById({id: STORAGE_KEY_GLOBAL_ENVS});
      await envStorageService.update({id: STORAGE_KEY_GLOBAL_ENVS, profiles: [...Object.values(existingEnvs.profiles || {}), ...withNewIds]});
      return withNewIds;
    } catch (e) {
      throw new Error("Invalid JSON format");
    }
  },
};
