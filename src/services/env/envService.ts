import { EnvProfile,  } from "@/types/env";
import { v4 as uuidv4 } from "uuid";
import { RemoteEnvStorage } from "./RemoteEnvStorage";
import { LocalEnvStorage } from "./LocalEnvStorage";
import { EnvStorageInterface } from "./EnvStorageTypes";

const STORAGE_KEY_GLOBAL_ENVS = "global";
const isProd = import.meta.env.PROD;

export const envStorageService: EnvStorageInterface = isProd
  ? new RemoteEnvStorage()
  : new LocalEnvStorage();

// export const envGService = {
//   // Project-level env profiles
//   getProjectEnvs: async (env): Promise<EnvProfile[]> => {
//     const profiles = await get(env, {})
//     return normalizeProfiles(profiles);
//   },
//   createProjectEnv: async (id, data: Omit<EnvProfile, "id" | "scope" | "createdAtUTC">): Promise<EnvProfile> => {
//     await new Promise((r) => setTimeout(r, 100));
//     const envs = await envService.getProjectEnvs(id);
//     const newEnv: EnvProfile = {
//       ...data,
//       id: uuidv4(),
//       scope: "project",
//       createdAtUTC: new Date().toISOString(),
//     };
//     update(STORAGE_KEY_GLOBAL_ENVS, [...envs, newEnv]);
//     return newEnv;
//   },
//   updateProjectEnv: async (id: UUID, updates: Partial<EnvProfile>): Promise<EnvProfile | null> => {
//     await new Promise((r) => setTimeout(r, 100));
//     const envs = await envService.getProjectEnvs();
//     const index = envs.findIndex((e) => e.id === id);
//     if (index === -1) return null;
    
//     envs[index] = { ...envs[index], ...updates, updatedAtUTC: new Date().toISOString() };
//     update(id, envs);
//     return envs[index];
//   },
//   deleteProjectEnv: async (id: UUID): Promise<boolean> => {
//     await new Promise((r) => setTimeout(r, 100));
//     const envs = await envService.getProjectEnvs();
//     const filtered = envs.filter((e) => e.id !== id);
//     update(id, filtered);
//     return filtered.length < envs.length;
//   },
//   setProjectDefault: async (id: UUID): Promise<void> => {
//     const envs = await envService.getProjectEnvs();
//     const updated = envs.map((e) => ({ ...e, isDefault: e.id === id }));
//     update(id, updated);
//   },
//   getWorkflowEnvs: async (workflowId: UUID): Promise<workflowEnvsdata> => {
//     const all = await get<Record<UUID, workflowEnvsdata>>(
//       workflowId,
//       {}
//     );

//     return all[workflowId] ?? {
//       workflowId,
//       envProfiles: [],
//       activeEnvId: null,
//     };
//   },
//   createWorkflowEnv: async (workflowId: UUID, data): Promise<EnvProfile> => {
//     // const all = await get<Record<UUID, workflowEnvsdata>>(workflowId, []);
//     // const workflowMeta = all[workflowId] ?? {
//     //   workflowId,
//     //   envProfiles: [],
//     //   activeEnvId: null,
//     // };

//     // const newEnv: EnvProfile = {
//     //   ...data,
//     //   id: uuidv4(),
//     //   scope: "workflow",
//     //   workflowId,
//     //   createdAtUTC: new Date().toISOString(),
//     // };

//     // workflowMeta.envProfiles = [...workflowMeta.envProfiles, newEnv];

//     // all[workflowId] = workflowMeta;
    
//     // await update(workflowId, all);
//     // return newEnv;
//   },
//   updateWorkflowEnv: async (workflowId: UUID, envId: UUID, updates: Partial<EnvProfile>): Promise<EnvProfile | null> => {
//     await new Promise((r) => setTimeout(r, 100));
//     const allWorkflowEnvs = await get<Record<UUID, workflowEnvsdata>>(workflowId, {});
//     const workflowMeta = allWorkflowEnvs[workflowId];
//     if (!workflowMeta) return null;
    
//     const index = workflowMeta.envProfiles.findIndex((e) => e.id === envId);
//     if (index === -1) return null;
    
//     workflowMeta.envProfiles[index] = { ...workflowMeta.envProfiles[index], ...updates, updatedAtUTC: new Date().toISOString() };
    
//     update(workflowId, allWorkflowEnvs);
//     return workflowMeta.envProfiles[index];
//   },
//   deleteWorkflowEnv: async (workflowId: UUID, envId: UUID): Promise<boolean> => {
//     const allWorkflowEnvs = await get<Record<UUID, workflowEnvsdata>>(workflowId, {});
//     const workflowMeta = allWorkflowEnvs[workflowId];
//     if (!workflowMeta) return false;
    
//     const prevLength = workflowMeta.envProfiles.length;
//     workflowMeta.envProfiles = workflowMeta.envProfiles.filter((e) => e.id !== envId);
    
//     update(workflowId, allWorkflowEnvs);
//     return workflowMeta.envProfiles.length < prevLength;
//   },
//   setWorkflowActiveEnv: async (id: UUID, envId: UUID | null): Promise<void> => {
//     const workflow = await get<Record<UUID, workflowEnvsdata>>( id, {});
//     const global = await get<Record<UUID, workflowEnvsdata>>( STORAGE_KEY_GLOBAL_ENVS, {});

//     const workflowMeta = global.find((e) => e.id === envId)
//     const cleanedGlobal = workflow.filter((workflow) => workflow?.scope !== "global")
//     workflowMeta.active = true
//     cleanedGlobal.push(workflowMeta)
//     await update(id, cleanedGlobal);
//   },
//   // Global active environment (project-wide)
//   getGlobalActiveEnv: async (): Promise<UUID | null> => {
//     return await get<UUID | null>("", null);
//   },
//   setGlobalActiveEnv: async (envId: UUID | null): Promise<void> => {
//     update(STORAGE_KEY_GLOBAL_ENVS, envId);
//   },
//   // Import/Export
//   exportProjectEnvs: async (): Promise<string> => {
//     const envs = await envService.getProjectEnvs();

//     return JSON.stringify(envs, null, 2);
//   },
//   importProjectEnvs: async (json: string): Promise<EnvProfile[]> => {
//     try {
//       // const envs = JSON.parse(json) as EnvProfile[];
//       // const withNewIds = envs.map((e) => ({ ...e, id: uuidv4(), createdAtUTC: new Date().toISOString() }));
//       // const existingEnvs = await envService.getProjectEnvs();
//       // update({id: STORAGE_KEY_GLOBAL_ENVS, ...existingEnvs, ...withNewIds});
//       // return withNewIds;
//       return []
//     } catch (e) {
//       throw new Error("Invalid JSON format");
//     }
//   },
// };
// const normalizeProfiles = (profiles: Record<string, EnvProfile>): EnvProfile[] => Object.values(profiles);

export const envService = {
  get: async() => {
    return await envStorageService.get()
  },
  getById: async({id}: {id: string}): Promise<any> => {
    return await envStorageService.get(id, {profiles: {}, active: []})
  },
  getProfiles: async({id}) => {
    return (await envService.getById({id}))["profiles"] 
  },
  getActive: async({id}) => {
    return (await envService.getById({id}))["active"]
  },
  create: async({id, profiles}): Promise<void> => {
    return await envStorageService.save({id, profiles: Object.values(profiles)})
  },
  updateProfiles: async({id, profileName, updates}): Promise<void> => {
    const existingEnv = await envService.getProfiles({id})
    existingEnv[profileName].values = updates.values
    return await envStorageService.update({id, profiles: Object.values(existingEnv)})
  },
  delete: async(id): Promise<string> => {
    await new Promise((r) => setTimeout(r, 100));
    const envs = await envService.get();
    const filtered = envs.filter((e) => e.id !== id);
    envStorageService.update({id, profiles: filtered});
    return filtered.length < envs.length;
  },
  setDefault: async(): Promise<string> => {
  
  },
  setActiveEnv: async({id, envId}): Promise<void> => {
    const workflowEnv = await envService.getById({id})
    const activeEnv = workflowEnv.active.filter((e) => e.scope !== "workflow")
    console.log({activeEnv: [...activeEnv, envId]})
    const saved = envId 
      ? await envStorageService.update({id, active: [...activeEnv, envId]})
      : await envStorageService.update({id, active: [...activeEnv]})
    return saved
  },
  setWorkflowActiveGlobalEnv: async({id, envId}): Promise<void> => {
    const get = await envService.getById({id: "global"})
    const workflowEnv = await envService.getById({id})
    const activeEnv = workflowEnv?.active?.filter((e) => e?.scope !== "global")
  
    const saved = envId 
      ? await envStorageService.update({id, active: [...activeEnv, get.profiles[envId]]})
      : await envStorageService.update({id, active: [...activeEnv]})
    return saved
  },
  export: async(): Promise<string> => {
  
  },
  import: async(json: string): Promise<EnvProfile[]> => {
    try {
      const envs = JSON.parse(json) as EnvProfile[];
      const withNewIds = Object.values(envs).map((e, i) => envs[i] = { ...e, id: uuidv4(), createdAtUTC: new Date().toISOString() });
      const existingEnvs = await envService.getById({id: STORAGE_KEY_GLOBAL_ENVS});
      envStorageService.update({id: STORAGE_KEY_GLOBAL_ENVS, ...existingEnvs, ...withNewIds });
      return withNewIds;
    } catch (e) {
      throw new Error("Invalid JSON format");
    }
  },
}