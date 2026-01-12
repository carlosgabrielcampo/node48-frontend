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
  // Project envs
  projectEnvs: EnvProfile[];
  globalEnvs: GlobalEnvsData;
  setGlobalEnvs: React.Dispatch<React.SetStateAction<GlobalEnvsData>>;
  loadingProjectEnvs: boolean;
  activeProjectEnvId: UUID | null;
  activeGlobalEnvId: UUID | null;
  setActiveProjectEnv: (id: UUID | null) => void;
  createProjectEnv: ({id, profiles, active}) => Promise<void>;
  updateProjectEnv: (id: UUID, updates: Partial<EnvProfile>) => Promise<void>;
  deleteProjectEnv: (id: UUID) => Promise<void>;
  setProjectDefault: (id: UUID) => Promise<void>;
  
  // Workflow envs
  workflowEnvs: workflowEnvsdata | null;
  loadWorkflowEnvs: (workflowId: UUID) => Promise<void>;
  createWorkflowEnv: (workflowId: UUID, data: Omit<EnvProfile, "id" | "scope" | "workflowId" | "createdAtUTC">) => Promise<void>;
  updateWorkflowEnv: (workflowId: UUID, envId: UUID, updates: Partial<EnvProfile>) => Promise<void>;
  deleteWorkflowEnv: (workflowId: UUID, envId: UUID) => Promise<void>;
  setWorkflowActiveEnv: (workflowId: UUID, envId: UUID | null) => Promise<void>;
  setGlobalActiveEnv: (id: UUID, envId: UUID | null) => Promise<void>;
  removeWorkflowActiveEnv: (id: UUID, envId: UUID | null) => void;
  
  // Resolved values
  getResolvedEnvValues: (workflowId?: UUID) => EnvValues;
  getEnvDiff: (workflowId?: UUID) => EnvDiff[];
  
  // Import/Export
  exportEnvs: () => Promise<string>;
  importEnvs: (json: string) => Promise<void>;
  
  // Helpers
  refreshProjectEnvs: () => Promise<void>;
  getActiveEnv: () => EnvProfile | null;
}

const EnvContext = createContext<EnvContextType | undefined>(undefined);

export const EnvProvider = ({ children }: { children: ReactNode }) => {
  const [globalEnvs, setGlobalEnvs] = useState<GlobalEnvsData>({ profiles: {}, active: [] });
  const [workflowEnvs, setWorkflowEnvs] = useState<workflowEnvsdata | null>(null);

  const [loadingProjectEnvs, setLoadingProjectEnvs] = useState(true);
  const [activeProjectEnvId, setActiveProjectEnvId] = useState<UUID | null>(null);
  const [activeGlobalEnvId, setActiveGlobalEnvId] = useState<UUID | null>(null);

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

  useEffect(() => {
    refreshProjectEnvs({id: "global"});
    envService.getActive({id: "global"}).then((env) => setActiveGlobalEnvId(env?.[0]?.id ?? null));
  }, [refreshProjectEnvs]);

  const setActiveProjectEnv = useCallback(async (id: UUID | null) => {
    setActiveProjectEnvId(id);
    await envService.setActiveEnv({id: "global", envId: id});
    toast.success(id ? "Environment switched" : "Environment cleared");
  }, []);

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

  // Workflow envs
  const loadWorkflowEnvs = useCallback(async (workflowId: UUID) => {
    const envs = await envService.getById({id: workflowId});
    setWorkflowEnvs(envs);
  }, []);

  const createWorkflowEnv = useCallback(async (workflowId: UUID, data: Omit<EnvProfile, "id" | "scope" | "workflowId" | "createdAtUTC">) => {
    // await envService.create({id: workflowId, profiles: [data as any], active: []});
    // await loadWorkflowEnvs(workflowId);
  }, [loadWorkflowEnvs]);

  const updateWorkflowEnv = useCallback(async (workflowId: UUID, envId: UUID, updates: Partial<EnvProfile>) => {
    // await envService.updateProfiles({id: workflowId, profileName: envId, updates});
    // await loadWorkflowEnvs(workflowId);
    // toast.success("Environment updated");
  }, [loadWorkflowEnvs]);

  const deleteWorkflowEnv = useCallback(async (workflowId: UUID, envId: UUID) => {
    await envService.delete(envId);
    await loadWorkflowEnvs(workflowId);
    toast.success("Environment deleted");
  }, [loadWorkflowEnvs]);

  const removeWorkflowActiveEnv = useCallback((id: UUID, envId: UUID | null) => {
  }, [workflowEnvs, globalEnvs]);

  const setGlobalActiveEnv = useCallback(async (id: UUID, envId: UUID | null) => {
    await envService.setWorkflowActiveGlobalEnv({id, envId});
    setActiveGlobalEnvId(envId);
    toast.success("Workflow environment switched");
  }, []);

  const setWorkflowActiveEnv = useCallback(async (id: UUID, envId: UUID | null) => {
    await envService.setActiveEnv({id, envId});
    setActiveProjectEnvId(envId);
    toast.success("Workflow environment switched");
  }, []);

  // Resolved values
  const getActiveEnv = useCallback((): EnvProfile | null => {
    if (workflowEnvs?.activeEnvId) {
      const workflowEnv = workflowEnvs.envProfiles.find((e) => e.id === workflowEnvs.activeEnvId);
      if (workflowEnv) return workflowEnv;
    }
    if (activeProjectEnvId && globalEnvs.profiles) {
      const projectEnv = globalEnvs.profiles[activeProjectEnvId];
      if (projectEnv) return projectEnv;
    }
    if (globalEnvs.profiles) {
      return Object.values(globalEnvs.profiles).find((e) => e.isDefault) || null;
    }
    return null;
  }, [globalEnvs, activeProjectEnvId, workflowEnvs]);

  const getResolvedEnvValues = useCallback((workflowId?: UUID): EnvValues => {
    const profiles = globalEnvs.profiles || {};
    const defaultEnv = Object.values(profiles).find((e) => e.isDefault);
    const activeEnv = activeProjectEnvId ? profiles[activeProjectEnvId] : defaultEnv;
    
    const resolved: EnvValues = { ...(activeEnv?.values || {}) };
    
    if (workflowId && workflowEnvs?.workflowId === workflowId) {
      const workflowActiveEnv = workflowEnvs.activeEnvId 
        ? workflowEnvs.envProfiles.find((e) => e.id === workflowEnvs.activeEnvId)
        : null;
      if (workflowActiveEnv) {
        Object.assign(resolved, workflowActiveEnv.values);
      }
    }
    
    return resolved;
  }, [globalEnvs.profiles, activeProjectEnvId, workflowEnvs]);

  const getEnvDiff = useCallback((workflowId?: UUID): EnvDiff[] => {
    return [];
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
        projectEnvs,
        exportEnvs,
        importEnvs,
        globalEnvs,
        getActiveEnv,
        setGlobalEnvs,
        workflowEnvs,
        loadWorkflowEnvs,
        createProjectEnv,
        updateProjectEnv,
        deleteProjectProfile,
        activeGlobalEnvId,
        setProjectDefault,
        createWorkflowEnv,
        updateWorkflowEnv,
        deleteWorkflowEnv,
        setGlobalActiveEnv,
        loadingProjectEnvs,
        activeProjectEnvId,
        refreshProjectEnvs,
        setActiveProjectEnv,
        setWorkflowActiveEnv,
        getResolvedEnvValues,
        getEnvDiff,
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
