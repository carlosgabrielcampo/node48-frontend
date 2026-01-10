import { EnvProfile, UUID, workflowEnvsdata } from "@/types/env";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY_GLOBAL_ENVS = "global";

const normalizeProfiles = (profiles: Record<string, EnvProfile>): EnvProfile[] => Object.values(profiles);

// Local storage helpers
const getFromStorage = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const response = await (await fetch(`http://localhost:4014/v1/envs/profiles/${key}`)).json();
    if (!response) return defaultValue;
    return response;
  
  } catch (error) {
    return defaultValue;
  }
};
const toProfileMap = (envs: EnvProfile[]) => Object.fromEntries(envs.map(e => [e.id, e]));

const updateStorage = async <T>({id, profiles, active}): Promise<void> => {
  try {
    const requestBody = {}
    if(profiles) requestBody["profiles"] = toProfileMap(profiles) 
    if(active) requestBody["active"] = active

    const response = await (await fetch(`http://localhost:4014/v1/envs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })).json();

    if(response.status === 200){ console.info("Env saved") }
    else{ console.error("Failed to save"); }
    return response

  } catch (e) {
    console.log(e)
    console.error("Failed to save");
  }
};
const saveToStorage = async <T>({id, profiles, active }): Promise<void> => {
  try {

    const requestBody = {}
    if(profiles) requestBody["profiles"] = toProfileMap(profiles) 
    if(active) requestBody["active"] = [active]

    const response = await (await fetch(`http://localhost:4014/v1/envs/profiles/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })).json();

    if(response.status === 201){ console.info("Env saved") }
    else{ console.error("Failed to save"); }

  } catch (e) {
    console.log(e)
    console.error("Failed to save");
  }
}

// export const envGService = {
//   // Project-level env profiles
//   getProjectEnvs: async (env): Promise<EnvProfile[]> => {
//     const profiles = await getFromStorage(env, {})
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
//     updateStorage(STORAGE_KEY_GLOBAL_ENVS, [...envs, newEnv]);
//     return newEnv;
//   },
//   updateProjectEnv: async (id: UUID, updates: Partial<EnvProfile>): Promise<EnvProfile | null> => {
//     await new Promise((r) => setTimeout(r, 100));
//     const envs = await envService.getProjectEnvs();
//     const index = envs.findIndex((e) => e.id === id);
//     if (index === -1) return null;
    
//     envs[index] = { ...envs[index], ...updates, updatedAtUTC: new Date().toISOString() };
//     updateStorage(id, envs);
//     return envs[index];
//   },
//   deleteProjectEnv: async (id: UUID): Promise<boolean> => {
//     await new Promise((r) => setTimeout(r, 100));
//     const envs = await envService.getProjectEnvs();
//     const filtered = envs.filter((e) => e.id !== id);
//     updateStorage(id, filtered);
//     return filtered.length < envs.length;
//   },
//   setProjectDefault: async (id: UUID): Promise<void> => {
//     const envs = await envService.getProjectEnvs();
//     const updated = envs.map((e) => ({ ...e, isDefault: e.id === id }));
//     updateStorage(id, updated);
//   },
//   getWorkflowEnvs: async (workflowId: UUID): Promise<workflowEnvsdata> => {
//     const all = await getFromStorage<Record<UUID, workflowEnvsdata>>(
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
//     // const all = await getFromStorage<Record<UUID, workflowEnvsdata>>(workflowId, []);
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
    
//     // await updateStorage(workflowId, all);
//     // return newEnv;
//   },
//   updateWorkflowEnv: async (workflowId: UUID, envId: UUID, updates: Partial<EnvProfile>): Promise<EnvProfile | null> => {
//     await new Promise((r) => setTimeout(r, 100));
//     const allWorkflowEnvs = await getFromStorage<Record<UUID, workflowEnvsdata>>(workflowId, {});
//     const workflowMeta = allWorkflowEnvs[workflowId];
//     if (!workflowMeta) return null;
    
//     const index = workflowMeta.envProfiles.findIndex((e) => e.id === envId);
//     if (index === -1) return null;
    
//     workflowMeta.envProfiles[index] = { ...workflowMeta.envProfiles[index], ...updates, updatedAtUTC: new Date().toISOString() };
    
//     updateStorage(workflowId, allWorkflowEnvs);
//     return workflowMeta.envProfiles[index];
//   },
//   deleteWorkflowEnv: async (workflowId: UUID, envId: UUID): Promise<boolean> => {
//     const allWorkflowEnvs = await getFromStorage<Record<UUID, workflowEnvsdata>>(workflowId, {});
//     const workflowMeta = allWorkflowEnvs[workflowId];
//     if (!workflowMeta) return false;
    
//     const prevLength = workflowMeta.envProfiles.length;
//     workflowMeta.envProfiles = workflowMeta.envProfiles.filter((e) => e.id !== envId);
    
//     updateStorage(workflowId, allWorkflowEnvs);
//     return workflowMeta.envProfiles.length < prevLength;
//   },
//   setWorkflowActiveEnv: async (id: UUID, envId: UUID | null): Promise<void> => {
//     const workflow = await getFromStorage<Record<UUID, workflowEnvsdata>>( id, {});
//     const global = await getFromStorage<Record<UUID, workflowEnvsdata>>( STORAGE_KEY_GLOBAL_ENVS, {});

//     const workflowMeta = global.find((e) => e.id === envId)
//     const cleanedGlobal = workflow.filter((workflow) => workflow?.scope !== "global")
//     workflowMeta.active = true
//     cleanedGlobal.push(workflowMeta)
//     await updateStorage(id, cleanedGlobal);
//   },
//   // Global active environment (project-wide)
//   getGlobalActiveEnv: async (): Promise<UUID | null> => {
//     return await getFromStorage<UUID | null>("", null);
//   },
//   setGlobalActiveEnv: async (envId: UUID | null): Promise<void> => {
//     updateStorage(STORAGE_KEY_GLOBAL_ENVS, envId);
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
//       // updateStorage({id: STORAGE_KEY_GLOBAL_ENVS, ...existingEnvs, ...withNewIds});
//       // return withNewIds;
//       return []
//     } catch (e) {
//       throw new Error("Invalid JSON format");
//     }
//   },
// };


export const envService = {
  get: async({id, defaultValue}: {id: string}): Promise<any> => {
    return await getFromStorage(id, defaultValue)
  },
  getProfiles: async({id}) => {
    return (await envService.get({id, defaultValue: {}}))["profiles"] 
  },
  getActive: async({id}) => {
    return (await envService.get({id, defaultValue: []}))["active"]
  },
  create: async({id, profiles}): Promise<void> => {
    return await saveToStorage({id, profiles: Object.values(profiles)})
  },
  updateProfiles: async({id, profileName, updates}): Promise<void> => {
    const existingEnv = await envService.getProfiles({id})
    existingEnv[profileName].values = updates.values
    return await updateStorage({id, profiles: Object.values(existingEnv)})
  },
  delete: async(): Promise<string> => {
  
  },
  setDefault: async(): Promise<string> => {
  
  },
  setActiveEnv: async({id, envId}): Promise<void> => {
    const workflowEnv = await envService.get({id})
    const activeEnv = workflowEnv.active.filter((e) => e.scope !== "workflow")
    console.log({activeEnv: [...activeEnv, envId]})
    const saved = envId 
      ? await updateStorage({id, active: [...activeEnv, envId]})
      : await updateStorage({id, active: [...activeEnv]})
    return saved
  },
  setWorkflowActiveGlobalEnv: async({id, envId}): Promise<void> => {
    const get = await envService.get({id: "global"})
    const workflowEnv = await envService.get({id})
    const activeEnv = workflowEnv?.active?.filter((e) => e?.scope !== "global")
    
    
    const saved = envId 
      ? await updateStorage({id, active: [...activeEnv, get.profiles[envId]]})
      : await updateStorage({id, active: [...activeEnv]})
    return saved
  },
  export: async(): Promise<string> => {
  
  },
  import: async(json: string): Promise<EnvProfile[]> => {
    try {
      const envs = JSON.parse(json) as EnvProfile[];
      const withNewIds = Object.values(envs).map((e, i) => envs[i] = { ...e, id: uuidv4(), createdAtUTC: new Date().toISOString() });
      const existingEnvs = await envService.get({id: STORAGE_KEY_GLOBAL_ENVS});
      updateStorage({id: STORAGE_KEY_GLOBAL_ENVS, ...existingEnvs, ...withNewIds });
      return withNewIds;
    } catch (e) {
      throw new Error("Invalid JSON format");
    }
  },
}

const envWorkflowService = {
  get: async(): Promise<string> => {

  },
  create: async(): Promise<string> => {
  
  },
  update: async(): Promise<string> => {
  
  },
  delete: async(): Promise<string> => {
  
  },
  setActiveEnv: async(): Promise<string> => {
  
  },
  getActiveEnv: async(): Promise<string> => {
  
  },
  export: async(): Promise<string> => {
  
  },
  import: async(): Promise<string> => {
  
  },
}