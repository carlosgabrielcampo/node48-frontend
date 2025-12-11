import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { EnvProfile, EnvValues, EnvDiff, UUID, WorkflowEnvMetadata } from "@/types/env";
import { envService } from "@/services/envService";
import { toast } from "sonner";

interface EnvContextType {
  // Project envs
  projectEnvs: EnvProfile[];
  loadingProjectEnvs: boolean;
  activeProjectEnvId: UUID | null;
  setActiveProjectEnv: (id: UUID | null) => void;
  createProjectEnv: (data: Omit<EnvProfile, "id" | "scope" | "createdAtUTC">) => Promise<EnvProfile>;
  updateProjectEnv: (id: UUID, updates: Partial<EnvProfile>) => Promise<void>;
  deleteProjectEnv: (id: UUID) => Promise<void>;
  setProjectDefault: (id: UUID) => Promise<void>;
  
  // Workflow envs
  workflowEnvMeta: WorkflowEnvMetadata | null;
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
  const [projectEnvs, setProjectEnvs] = useState<EnvProfile[]>([]);
  const [loadingProjectEnvs, setLoadingProjectEnvs] = useState(true);
  const [activeProjectEnvId, setActiveProjectEnvIdState] = useState<UUID | null>(null);
  const [workflowEnvMeta, setWorkflowEnvMeta] = useState<WorkflowEnvMetadata | null>(null);

  // Load project envs on mount
  useEffect(() => {
    refreshProjectEnvs();
    envService.getGlobalActiveEnv().then((id) => setActiveProjectEnvIdState(id));
  }, []);

  const refreshProjectEnvs = useCallback(async () => {
    setLoadingProjectEnvs(true);
    try {
      const envs = await envService.getProjectEnvs();
      setProjectEnvs(envs);
    } catch (e) {
      toast.error("Failed to load environments");
    } finally {
      setLoadingProjectEnvs(false);
    }
  }, []);

  const setActiveProjectEnv = useCallback(async (id: UUID | null) => {
    setActiveProjectEnvIdState(id);
    await envService.setGlobalActiveEnv(id);
    toast.success(id ? "Environment switched" : "Environment cleared");
  }, []);

  const createProjectEnv = useCallback(async (data: Omit<EnvProfile, "id" | "scope" | "createdAtUTC">) => {
    const newEnv = await envService.createProjectEnv(data);
    setProjectEnvs((prev) => [...prev, newEnv]);
    toast.success("Environment created");
    return newEnv;
  }, []);

  const updateProjectEnv = useCallback(async (id: UUID, updates: Partial<EnvProfile>) => {
    const updated = await envService.updateProjectEnv(id, updates);
    if (updated) {
      setProjectEnvs((prev) => prev.map((e) => (e.id === id ? updated : e)));
      toast.success("Environment updated");
    }
  }, []);

  const deleteProjectEnv = useCallback(async (id: UUID) => {
    await envService.deleteProjectEnv(id);
    setProjectEnvs((prev) => prev.filter((e) => e.id !== id));
    if (activeProjectEnvId === id) {
      setActiveProjectEnvIdState(null);
    }
    toast.success("Environment deleted");
  }, [activeProjectEnvId]);

  const setProjectDefault = useCallback(async (id: UUID) => {
    await envService.setProjectDefault(id);
    setProjectEnvs((prev) => prev.map((e) => ({ ...e, isDefault: e.id === id })));
    toast.success("Default environment set");
  }, []);

  // Workflow envs
  const loadWorkflowEnvs = useCallback(async (workflowId: UUID) => {
    const meta = await envService.getWorkflowEnvs(workflowId);
    setWorkflowEnvMeta(meta);
  }, []);

  const createWorkflowEnv = useCallback(async (workflowId: UUID, data: Omit<EnvProfile, "id" | "scope" | "workflowId" | "createdAtUTC">) => {
    const newEnv = await envService.createWorkflowEnv(workflowId, data);
    setWorkflowEnvMeta((prev) => prev ? { ...prev, envProfiles: [...prev.envProfiles, newEnv] } : null);
    toast.success("Workflow environment created");
    return newEnv;
  }, []);

  const updateWorkflowEnv = useCallback(async (workflowId: UUID, envId: UUID, updates: Partial<EnvProfile>) => {
    const updated = await envService.updateWorkflowEnv(workflowId, envId, updates);
    if (updated) {
      setWorkflowEnvMeta((prev) => prev ? {
        ...prev,
        envProfiles: prev.envProfiles.map((e) => (e.id === envId ? updated : e)),
      } : null);
      toast.success("Environment updated");
    }
  }, []);

  const deleteWorkflowEnv = useCallback(async (workflowId: UUID, envId: UUID) => {
    await envService.deleteWorkflowEnv(workflowId, envId);
    setWorkflowEnvMeta((prev) => prev ? {
      ...prev,
      envProfiles: prev.envProfiles.filter((e) => e.id !== envId),
    } : null);
    toast.success("Environment deleted");
  }, []);

  const setWorkflowActiveEnv = useCallback(async (workflowId: UUID, envId: UUID | null) => {
    await envService.setWorkflowActiveEnv(workflowId, envId);
    setWorkflowEnvMeta((prev) => prev ? { ...prev, activeEnvId: envId } : null);
    toast.success("Workflow environment switched");
  }, []);

  // Resolved values
  const getActiveEnv = useCallback((): EnvProfile | null => {
    // Workflow-specific active env takes precedence
    if (workflowEnvMeta?.activeEnvId) {
      const workflowEnv = workflowEnvMeta.envProfiles.find((e) => e.id === workflowEnvMeta.activeEnvId);
      if (workflowEnv) return workflowEnv;
    }
    // Fall back to project active env
    if (activeProjectEnvId) {
      const projectEnv = projectEnvs.find((e) => e.id === activeProjectEnvId);
      if (projectEnv) return projectEnv;
    }
    // Fall back to default project env
    return projectEnvs.find((e) => e.isDefault) || null;
  }, [projectEnvs, activeProjectEnvId, workflowEnvMeta]);

  const getResolvedEnvValues = useCallback((workflowId?: UUID): EnvValues => {
    const defaultEnv = projectEnvs.find((e) => e.isDefault);
    const activeEnv = activeProjectEnvId ? projectEnvs.find((e) => e.id === activeProjectEnvId) : defaultEnv;
    
    // Start with project values
    const resolved: EnvValues = { ...(activeEnv?.values || {}) };
    
    // Overlay workflow overrides
    if (workflowId && workflowEnvMeta?.workflowId === workflowId) {
      const workflowActiveEnv = workflowEnvMeta.activeEnvId 
        ? workflowEnvMeta.envProfiles.find((e) => e.id === workflowEnvMeta.activeEnvId)
        : null;
      if (workflowActiveEnv) {
        Object.assign(resolved, workflowActiveEnv.values);
      }
    }
    
    return resolved;
  }, [projectEnvs, activeProjectEnvId, workflowEnvMeta]);

  const getEnvDiff = useCallback((workflowId?: UUID): EnvDiff[] => {
    const defaultEnv = projectEnvs.find((e) => e.isDefault);
    const activeEnv = activeProjectEnvId ? projectEnvs.find((e) => e.id === activeProjectEnvId) : defaultEnv;
    const projectValues = activeEnv?.values || {};
    
    let workflowOverrides: EnvValues = {};
    if (workflowId && workflowEnvMeta?.workflowId === workflowId && workflowEnvMeta.activeEnvId) {
      const workflowEnv = workflowEnvMeta.envProfiles.find((e) => e.id === workflowEnvMeta.activeEnvId);
      workflowOverrides = workflowEnv?.values || {};
    }
    
    const allKeys = new Set([...Object.keys(projectValues), ...Object.keys(workflowOverrides)]);
    const diff: EnvDiff[] = [];
    
    allKeys.forEach((key) => {
      const projectValue = projectValues[key];
      const workflowOverride = workflowOverrides[key];
      const hasOverride = key in workflowOverrides;
      
      diff.push({
        key,
        projectValue,
        workflowOverride: hasOverride ? workflowOverride : undefined,
        resolvedValue: hasOverride ? workflowOverride : projectValue,
        source: hasOverride ? "workflow" : "project",
      });
    });
    
    return diff.sort((a, b) => a.key.localeCompare(b.key));
  }, [projectEnvs, activeProjectEnvId, workflowEnvMeta]);

  // Import/Export
  const exportEnvs = useCallback(async () => {
    return envService.exportProjectEnvs();
  }, []);

  const importEnvs = useCallback(async (json: string) => {
    await envService.importProjectEnvs(json);
    await refreshProjectEnvs();
    toast.success("Environments imported");
  }, [refreshProjectEnvs]);

  return (
    <EnvContext.Provider
      value={{
        projectEnvs,
        loadingProjectEnvs,
        activeProjectEnvId,
        setActiveProjectEnv,
        createProjectEnv,
        updateProjectEnv,
        deleteProjectEnv,
        setProjectDefault,
        workflowEnvMeta,
        loadWorkflowEnvs,
        createWorkflowEnv,
        updateWorkflowEnv,
        deleteWorkflowEnv,
        setWorkflowActiveEnv,
        getResolvedEnvValues,
        getEnvDiff,
        exportEnvs,
        importEnvs,
        refreshProjectEnvs,
        getActiveEnv,
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
