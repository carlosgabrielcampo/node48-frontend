import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { EnvProfile, EnvValues, EnvDiff, UUID, workflowEnvsdata } from "@/types/env";
import { envService } from "@/services/env/envService";
import { toast } from "sonner";
import { profile } from "console";

interface GlobalEnvsData {
  profiles: Record<string, EnvProfile>;
  active: EnvProfile[];
}

interface EnvContextType {
  projectEnvs: EnvProfile[];
  globalEnvs: GlobalEnvsData;
  setGlobalEnvs: React.Dispatch<React.SetStateAction<GlobalEnvsData>>;
  loadingProjectEnvs: boolean;
  activeProjectEnv: UUID | null;
  setActiveProjectEnv: (id: UUID | null) => void;
  createProjectEnv: ({id, profiles, active}) => Promise<void>;
  updateProjectEnv: (id: UUID, updates: Partial<EnvProfile>) => Promise<void>;
  deleteProjectEnv: (id: UUID) => Promise<void>;
  setProjectDefault: (id: UUID) => Promise<void>;
  
  workflowEnvs: workflowEnvsdata | null;
  loadWorkflowEnvs: (workflowId: UUID) => Promise<void>;
  deleteWorkflowEnv: (workflowId: UUID, envId: UUID) => Promise<void>;
  setWorkflowActiveEnv: (workflowId: UUID, envId: UUID | null, type: "workflow" | "global") => Promise<void>;
  removeWorkflowActiveEnv: (id: UUID, envId: UUID | null) => void;
  
  // Import/Export
  exportEnvs: () => Promise<string>;
  importEnvs: (json: string) => Promise<void>;
  
  // Helpers
  refreshProjectEnvs: () => Promise<void>;
}

const EnvContext = createContext<EnvContextType | undefined>(undefined);

export const EnvProvider = ({ children }: { children: ReactNode }) => {
  const [globalEnvs, setGlobalEnvs] = useState<GlobalEnvsData>({ profiles: {}, active: [] });
  const [workflowEnvs, setWorkflowEnvs] = useState<workflowEnvsdata | null>(null);
  const [loadingProjectEnvs, setLoadingProjectEnvs] = useState(true);
  const [activeProjectEnv, setActiveProject] = useState<UUID | null>(null);

  const refreshProjectEnvs = useCallback(async ({id}) => {
    setLoadingProjectEnvs(true);
    try {
      const global = await envService.getById({id}) ?? { profiles: {}, active: [] };
      setGlobalEnvs(global);
    } catch (e) {
      toast.error("Failed to load environments");
    } finally {
      setLoadingProjectEnvs(false);
    }
  }, []);

  useEffect(() => {refreshProjectEnvs({id: "global"});}, [refreshProjectEnvs]);

  const getActiveEnvs = useCallback( async ({id}) => {
    console.log({id})
    return await envService.getActive({id})
  }, [])

  const createProjectEnv = useCallback(async ({id, profiles, active}) => {
    await envService.create({id, profiles, active});
    await refreshProjectEnvs({id});
    toast.success("Environment created");
  }, [refreshProjectEnvs]);

  const updateProjectEnv = useCallback(async (env: string, id: UUID, updates: Partial<EnvProfile>) => {
    await envService.updateProfiles({id: env, profileName: id, updates});
  }, []);

  const deleteProjectProfile = useCallback(async (env, profile: UUID) => {
    await envService.deleteProfile(env, profile);
    await refreshProjectEnvs({id: env});
    toast.success("Environment deleted");
  }, [refreshProjectEnvs]);

  const setProjectDefault = useCallback(async (env: UUID, profileName: UUID) => {
    await envService.setDefault({env, profileName});
    await refreshProjectEnvs({id: env});
    toast.success("Default environment set");
  }, [refreshProjectEnvs]);

  const loadWorkflowEnvs = useCallback(async (workflowId: UUID) => {
    const envs = await envService.getById({id: workflowId});
    setWorkflowEnvs(envs);
  }, []);

  const deleteWorkflowEnv = useCallback(async (workflowId: UUID, envId: UUID) => {
    await envService.delete(envId);
    await loadWorkflowEnvs(workflowId);
    toast.success("Environment deleted");
  }, [loadWorkflowEnvs]);

  const removeWorkflowActiveEnv = useCallback((id: UUID, envId: UUID | null) => {
  }, [workflowEnvs, globalEnvs]);

  const setWorkflowActiveEnv = useCallback(async (id: UUID, envId: UUID | null, type: "workflow" | "global") => {
    await envService.setActiveEnv({id, envId, type});
    await loadWorkflowEnvs(id);
    toast.success("Workflow environment switched");
  }, []);

  const exportEnvs = useCallback(async () => {
    return JSON.stringify(globalEnvs.profiles, null, 2);
  }, [globalEnvs]);

  const importEnvs = useCallback(async (json: string) => {
    await envService.import(json);
    await refreshProjectEnvs();
    toast.success("Environments imported");
  }, [refreshProjectEnvs]);

  const projectEnvs = globalEnvs.profiles ? Object.values(globalEnvs.profiles) : [];

  return (
    <EnvContext.Provider
      value={{
        exportEnvs,
        importEnvs,
        globalEnvs,
        workflowEnvs,
        projectEnvs,
        setGlobalEnvs,
        getActiveEnvs,
        activeProjectEnv,
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
