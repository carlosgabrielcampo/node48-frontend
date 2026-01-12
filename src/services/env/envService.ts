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
    const getById = await envStorageService.get(id, {profiles: {}, active: []});
    return getById[id]
  },
  getProfiles: async ({id}: {id: string}) => {
    return (await envService.getById({id}))["profiles"];
  },
  getActive: async ({id}: {id: string}) => {
    return (await envService.getById({id}))?.["active"];
  },
  create: async ({id, profiles, active}: {id: string; profiles: any; active: any[]}): Promise<void> => {
    return await envStorageService.save({id, profiles, active});
  },
  updateProfiles: async ({id, profileName, updates}: {id: string; profileName: string; updates: any}): Promise<any> => {
    return await envStorageService.update({id, profiles: {[profileName]: updates}})
  },
  deleteProfile: async (env, profileName): Promise<void> => {
    return await envStorageService.deleteProfile(env, profileName)
  },
  setDefault: async ({env, profileName}): Promise<void> => {
    return await envStorageService.setDefault(env, profileName)
  },
  setActiveEnv: async ({id, envId, type}: {id: string; envId: string | null; type: "global" | "workflow"}): Promise<void> => {
    return await envStorageService.setActive(id, envId, type)
  },
  removeActiveEnv: async({id, envId}: {id: string; envId: string | null}): Promise<void> => {
    return await envStorageService.removeActive(id, envId)
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
