import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { EnvProfile, UUID, workflowEnvsdata } from "@/types/env";
import { envService } from "@/services/env/envService";
import { toast } from "sonner";
import { v4 as uuid } from "uuid";

interface GlobalEnvsData {
  profiles: Record<string, EnvProfile>;
  global: Record<string, EnvProfile>;
}

interface EnvContextType {
  allEnvs: Record<string, GlobalEnvsData[]>;
  workflowEnvs: workflowEnvsdata | null;
  loadingProjectEnvs: boolean;

  setAllEnvs: React.Dispatch<React.SetStateAction<EnvProfile[]>>;
  getActiveEnvs: ({ id }: { id: string }) => Promise<EnvProfile>;
  createProjectEnv: ({id, profiles, active}) => Promise<void>;
  updateProjectEnv: (id: UUID, updates: Partial<EnvProfile>) => Promise<void>;
  deleteProjectEnv: (id: UUID) => Promise<void>;
  setProjectDefault: (id: UUID) => Promise<void>;
  
  loadWorkflowEnvs: (workflowId: UUID) => Promise<void>;
  deleteWorkflowEnv: (workflowId: UUID, envId: UUID) => Promise<void>;
  setWorkflowActiveEnv: (workflowId: UUID, envId: UUID | null, type: "workflow" | "global") => Promise<void>;
  removeWorkflowActiveEnv: (id: UUID, envId: UUID | null, type: "global" | "local") => void;
  
  // Import/Export
  exportEnvs: () => Promise<string>;
  importEnvs: (json: string) => Promise<void>;
  
  // Helpers
  refreshProjectEnvs: () => Promise<void>;
}

const EnvContext = createContext<EnvContextType | undefined>(undefined);

export const EnvProvider = ({ children }: { children: ReactNode }) => {
  const [allEnvs, setAllEnvs] = useState<EnvProfile[]>({'global': {'profiles': {},  }});
  const [workflowEnvs, setWorkflowEnvs] = useState<workflowEnvsdata | null>(null);
  const [loadingProjectEnvs, setLoadingProjectEnvs] = useState(true);

  const refreshProjectEnvs = useCallback(async ({id}) => {
    setLoadingProjectEnvs(true);
    try {
      const envs = await envService.get() ?? {};
      setAllEnvs(envs);
    } catch (e) {
      toast.error("Failed to load environments");
    } finally {
      setLoadingProjectEnvs(false);
    }
  }, []);

  useEffect(() => {
    refreshProjectEnvs({id: "global"});
  }, [refreshProjectEnvs]);

  const getActiveEnvs = useCallback( async ({id}) => {
    return {"global": await envService.getById({id: "global"}), [id]: await envService.getById({id})}
  }, [])

  const create = useCallback(async ({id, profiles}) => {
    await envService.create({id, profiles});
    await refreshProjectEnvs({id});
    toast.success("Environment created");
  }, [refreshProjectEnvs])

  const createProjectEnv = useCallback(async ({id, profileName}) => {
    const profileId = uuid()
    const profileObj = { values: {}, id: profileId, name: profileName, scope: "workflow", createdAt: new Date(), updatedAt: new Date() }
    create({id, profiles: { [profileId]: profileObj }});
  }, [create, allEnvs]);

  const updateProjectEnv = useCallback(async (env: string, id: UUID, updates: Partial<EnvProfile>) => {
    await envService.updateProfiles({id: env, profileId: id, updates});
    await refreshProjectEnvs({id});
    toast.success("Environment updated");
  }, []);

  const deleteProjectProfile = useCallback(async (env, profile: UUID) => {
    await envService.deleteProfile(env, profile);
    await refreshProjectEnvs({id: env});
    toast.success("Environment deleted");
  }, [refreshProjectEnvs]);

  const setProjectDefault = useCallback(async (env: UUID, profileId: UUID) => {
    await envService.setDefault({env, profileId});
    await refreshProjectEnvs({id: env});
    toast.success("Default environment set");
  }, [refreshProjectEnvs]);

  const loadWorkflowEnvs = useCallback(async (workflowId: UUID) => {
    let envs = await envService.getById({id: workflowId});
    if(!envs){ envs = await create({id: workflowId, profiles: {}}) }
    setWorkflowEnvs(envs);
  }, []);

  const deleteWorkflowEnv = useCallback(async (workflowId: UUID, envId: UUID) => {
    await envService.deleteProfile(envId);
    await loadWorkflowEnvs(workflowId);
    toast.success("Environment deleted");
  }, [loadWorkflowEnvs]);

  const removeWorkflowActiveEnv = useCallback(async (workflowId: UUID, envId: UUID | null, type: "global" | "local") => {
    return await envService.removeActiveEnv({id: workflowId, envId, type});
  }, []);

  const setWorkflowActiveEnv = useCallback(async (id: UUID, envId: UUID | null, type: "workflow" | "global") => {
     return await envService.setActiveEnv({id, envId, type});
  }, []);

  const exportEnvs = useCallback(async ({id}) => {
    Object.entries(allEnvs[id].profiles).map(([key, value]) => {
      delete allEnvs[id].profiles[key].isDefault
    })
    return JSON.stringify(allEnvs[id].profiles, null, 2);
  }, [allEnvs]);

  const importEnvs = useCallback(async (json: string, id: string) => {
    await envService.import(json, id);
    await refreshProjectEnvs({id});
    toast.success("Environments imported");
  }, [refreshProjectEnvs]);

  const projectEnvs = allEnvs.profiles ? Object.values(allEnvs.profiles) : [];

  return (
    <EnvContext.Provider
      value={{
        allEnvs,
        exportEnvs,
        importEnvs,
        workflowEnvs,
        projectEnvs,
        setAllEnvs,
        getActiveEnvs,
        loadWorkflowEnvs,
        createProjectEnv,
        updateProjectEnv,
        setProjectDefault,
        deleteWorkflowEnv,
        loadingProjectEnvs,
        refreshProjectEnvs,
        deleteProjectProfile,
        setWorkflowActiveEnv,
        removeWorkflowActiveEnv,
      }}
    >
      {children}
    </EnvContext.Provider>
  );
};

export const useEnv = () => {
  const context = useContext(EnvContext);
  if (!context) {
    throw new Error("useEnv must be used within an EnvProvider");
  }
  return context;
};
