import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { EnvProfile, EnvValues, EnvDiff, UUID, workflowEnvsdata } from "@/types/env";
import { envService } from "@/services/env/EnvService";
import { toast } from "sonner";

interface EnvContextType {
  // Project envs
  projectEnvs: EnvProfile[];
  globalEnvs: EnvProfile[];
  loadingProjectEnvs: boolean;
  activeProjectEnvId: UUID | null;
  setActiveProjectEnv: (id: UUID | null) => void;
  createProjectEnv: (data: Omit<EnvProfile, "id" | "scope" | "createdAtUTC">) => Promise<EnvProfile>;
  updateProjectEnv: (id: UUID, updates: Partial<EnvProfile>) => Promise<void>;
  deleteProjectEnv: (id: UUID) => Promise<void>;
  setProjectDefault: (id: UUID) => Promise<void>;
  
  // Workflow envs
  workflowEnvs: workflowEnvsdata | null;
  loadWorkflowEnvs: (workflowId: UUID) => Promise<void>;
  createWorkflowEnv: (workflowId: UUID, data: Omit<EnvProfile, "id" | "scope" | "workflowId" | "createdAtUTC">) => Promise<EnvProfile>;
  updateWorkflowEnv: (workflowId: UUID, envId: UUID, updates: Partial<EnvProfile>) => Promise<void>;
  deleteWorkflowEnv: (workflowId: UUID, envId: UUID) => Promise<void>;
  setWorkflowActiveEnv: (workflowId: UUID, envId: UUID | null) => Promise<void>;
  
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
  const [globalEnvs, setGlobalEnvs] = useState<EnvProfile[]>({});
  const [workflowEnvs, setWorkflowEnvs] = useState<EnvProfile>({});

  const [loadingProjectEnvs, setLoadingProjectEnvs] = useState(true);
  const [activeProjectEnvId, setActiveProjectEnvId] = useState<UUID | null>(null);
  const [activeGlobalEnvId, setActiveGlobalEnvId] = useState<UUID | null>(null);

  const refreshProjectEnvs = useCallback(async () => {
    setLoadingProjectEnvs(true);
    try {
      const global = await envService.get({id: "global"}) ?? { profiles: {}, active: []}
      setGlobalEnvs(global);
    } catch (e) {
      toast.error("Failed to load environments");
    } finally {
      setLoadingProjectEnvs(false);
    }
  }, []);

  useEffect(() => {
    refreshProjectEnvs();
    envService.getActive({id: "global"}).then((env) => setActiveGlobalEnvId(env?.[0]?.id))
  }, []);


  const setActiveProjectEnv = useCallback(async (id: UUID | null) => {
    setActiveProjectEnvId(id);
    await envService.setGlobalActiveEnv(id);
    toast.success(id ? "Environment switched" : "Environment cleared");
  }, []);

  const createProjectEnv = useCallback(async (id, data: Omit<EnvProfile, "id" | "scope" | "createdAtUTC">) => {
    console.log({id, data})
    const newEnv = await envService.create({id, profiles: data});
    setGlobalEnvs((prev) => ({...prev, newEnv}));
    toast.success("Environment created");
    return newEnv;
  }, []);

  const updateProjectEnv = useCallback(async (id: UUID, updates: Partial<EnvProfile>) => {
    const updated = await envService.updateProjectEnv(id, updates);
    if (updated) {
      setGlobalEnvs((prev) => prev.map((e) => (e.id === id ? updated : e)));
      toast.success("Environment updated");
    }
  }, []);

  const deleteProjectEnv = useCallback(async (id: UUID) => {
    await envService.delete(id);
    setGlobalEnvs((prev) => {
      const next = prev.filter((e) => e.id !== id);

      if (activeProjectEnvId === id) {
        const fallback = next.find(e => e.isDefault) ?? null;
        setActiveProjectEnvId(fallback?.id ?? null);
        envService.setGlobalActiveEnv(fallback?.id ?? null);
      }

      return next;
    });

    toast.success("Environment deleted");
  }, [activeProjectEnvId]);

  const setProjectDefault = useCallback(async (id: UUID) => {
    await envService.setProjectDefault(id);

    setGlobalEnvs((prev) =>
      prev.map((e) => ({ ...e, isDefault: e.id === id }))
    );

    if (!activeProjectEnvId) {
      setActiveProjectEnvId(id);
      await envService.setGlobalActiveEnv(id);
    }

    toast.success("Default environment set");
  }, [activeProjectEnvId]);

  // Workflow envs
  const loadWorkflowEnvs = useCallback(async (workflowId: UUID) => {
    // console.log({workflowId})
    const meta = await envService.get({id: workflowId})
    setWorkflowEnvs({...meta});
    return meta
    // console.log({workflowEnvs})
  }, []);

  const createWorkflowEnv = useCallback(async (workflowId: UUID, data: Omit<EnvProfile, "id" | "workflowId" | "createdAtUTC">) => {
    console.log({createWorkflowEnv: data})
    const newEnv = await envService.create({id: workflowId, profiles: [data]});
    // setWorkflowEnvs((prev) => prev ? { ...prev, envProfiles: [...prev.envProfiles, newEnv] } : null);    
    // toast.success("Workflow environment created");
    return newEnv;
  }, []);

  const updateWorkflowEnv = useCallback(async (workflowId: UUID, envId: UUID, updates: Partial<EnvProfile>) => {
    const updated = await envService.updateProfiles({id: workflowId, profileName: envId, updates});
    if (updated) {
      setWorkflowEnvs(updated);
      toast.success("Environment updated");
    }
  }, []);

  const deleteWorkflowEnv = useCallback(async (workflowId: UUID, envId: UUID) => {
    await envService.deleteWorkflowEnv(workflowId, envId);
    // setWorkflowEnvs((prev) => prev ? {
    //   ...prev,
    //   envProfiles: prev.envProfiles.filter((e) => e.id !== envId),
    // } : null);
    toast.success("Environment deleted");
  }, []);

  const removeWorkflowActiveEnv = useCallback(async (id: UUID, envId: UUID | null) => {
    console.log({id, envId, globalEnvs, workflowEnvs})
    // await envService.setWorkflowActiveGlobalEnv({id, envId});
    // setWorkflowEnvs((prev) => prev ? { ...prev, activeEnvId: envId } : null);
    // setActiveGlobalEnvId(envId)
    // toast.success("Workflow environment switched");
  }, [workflowEnvs]);

  const setGlobalActiveEnv = useCallback(async (id: UUID, envId: UUID | null) => {
    await envService.setWorkflowActiveGlobalEnv({id, envId});
    console.log({setGlobalActiveEnv: id, envId, workflowEnvs, globalEnvs})
    // setWorkflowEnvs((prev) => prev ? { ...prev, active: [...prev?.active?.filter((e) => e.scope !== 'global'), globalEnvs?.profiles[envId]] } : null);
    setActiveGlobalEnvId(envId)
    toast.success("Workflow environment switched");
  }, [globalEnvs, workflowEnvs]);

  const setWorkflowActiveEnv = useCallback(async (id: UUID, envId: any) => {
    console.log({id, envId})
    await envService.setWorkflowActiveGlobalEnv({id, envId});
    setActiveProjectEnvId(envId)
    toast.success("Workflow environment switched");
  }, []);

  // Resolved values
  const getActiveEnv = useCallback((): EnvProfile | null => {
    // Workflow-specific active env takes precedence
    if (workflowEnvs?.activeEnvId) {
      const workflowEnv = workflowEnvs.envProfiles.find((e) => e.id === workflowEnvs.activeEnvId);
      if (workflowEnv) return workflowEnv;
    }
    // Fall back to project active env
    if (activeProjectEnvId) {
      const projectEnv = globalEnvs.find((e) => e.id === activeProjectEnvId);
      if (projectEnv) return projectEnv;
    }
    // Fall back to default project env
    return Object.values(globalEnvs.profiles).find((e) => e.isDefault) || null;
  }, [globalEnvs, activeProjectEnvId, workflowEnvs]);

  const getResolvedEnvValues = useCallback((workflowId?: UUID): EnvValues => {
    const defaultEnv = Object.values(globalEnvs.profiles).find((e) => e.isDefault);
    const activeEnv = activeProjectEnvId ? Object.values(globalEnvs.profiles).find((e) => e.id === activeProjectEnvId) : defaultEnv;
    
    // Start with project values
    const resolved: EnvValues = { ...(activeEnv?.values || {}) };
    
    // Overlay workflow overrides
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

  // Import/Export
  const exportEnvs = useCallback(async () => {
    return envService.exportProjectEnvs();
  }, []);

  const importEnvs = useCallback(async (json: string) => {
    await envService.import.importProjectEnvs(json);
    await refreshProjectEnvs();
    toast.success("Environments imported");
  }, [refreshProjectEnvs]);

  return (
    <EnvContext.Provider
      value={{
        exportEnvs,
        importEnvs,
        globalEnvs,
        getActiveEnv,
        setGlobalEnvs,
        workflowEnvs,
        loadWorkflowEnvs,
        createProjectEnv,
        updateProjectEnv,
        deleteProjectEnv,
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
