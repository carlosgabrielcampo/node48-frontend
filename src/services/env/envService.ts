import { EnvProfile } from "@/types/env";
import { v4 as uuidv4 } from "uuid";
import { LocalEnvStorage } from "./LocalEnvStorage";
import { EnvStorageInterface } from "./EnvStorageTypes";

const STORAGE_KEY_GLOBAL_ENVS = "global";
const isProd = import.meta.env.PROD;

export const envStorageService: EnvStorageInterface = new LocalEnvStorage()
  // ? new RemoteEnvStorage()
  // : new LocalEnvStorage();

export const envService = {
  get: async (id) => {
    return await envStorageService.get(id);
  },
  getById: async ({id}: {id: string}): Promise<any> => {
    const getById = await envStorageService.get(id, {profiles: {}});
    return getById[id]
  },
  getProfiles: async ({id}: {id: string}) => {
    return (await envService.getById({id}))["profiles"];
  },
  getActive: async ({id}: {id: string}) => {
    return (await envService.getById({id}))?.["active"];
  },
  create: async ({id, profiles}: {id: string; profiles: any;}): Promise<void> => {
    return await envStorageService.save({id, profiles});
  },
  updateProfiles: async ({id, profileId, updates}: {id: string; profileId: string; updates: any}): Promise<any> => {
    return await envStorageService.update({id, profiles: {[profileId]: {...updates, updatedAt: new Date()}}})
  },
  deleteProfile: async (env, profileId): Promise<void> => {
    return await envStorageService.deleteProfile(env, profileId)
  },
  setDefault: async ({env, profileId}): Promise<void> => {
    return await envStorageService.setDefault(env, profileId)
  },
  setActiveEnv: async ({id, envId, type}: {id: string; envId: string | null; type: "global" | "workflow"}): Promise<void> => {
    return await envStorageService.setActive(id, envId, type)
  },
  removeActiveEnv: async({id, envId, type}: {id: string; envId: string | null; type: string}): Promise<void> => {
    return await envStorageService.removeActive(id, envId, type)
  },
  export: async ({id}): Promise<string> => {
    const envs = await envService.getById({id});
    return JSON.stringify(envs.profiles, null, 2);
  },
  import: async (json: string, id: string ): Promise<void> => {
    try {
      const envs = JSON.parse(json) as Record<string, EnvProfile>;      
      return await envStorageService.save({id, profiles: envs});
    } catch (e) {
      console.error(e)
      throw new Error("Invalid JSON format");
    }
  },
};
