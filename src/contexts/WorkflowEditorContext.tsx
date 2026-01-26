import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface WorkflowEditorContextType {
  isDirty: boolean;
  setDirty: (dirty: boolean) => void;
  markDirty: () => void;
  clearDirty: () => void;
  lastSavedAt: Date | null;
  setLastSavedAt: (date: Date | null) => void;
  
  // Autosave
  autosaveEnabled: boolean;
  setAutosaveEnabled: (enabled: boolean) => void;
  
  // Unsaved changes modal
  showUnsavedModal: boolean;
  setShowUnsavedModal: (show: boolean) => void;
  pendingNavigation: string | null;
  setPendingNavigation: (path: string | null) => void;
  
  // Conflict detection
  hasConflict: boolean;
  setHasConflict: (conflict: boolean) => void;
  // conflictData: { local: any; remote: any } | null;
  // setConflictData: (data: { local: any; remote: any } | null) => void;
}

const WorkflowEditorContext = createContext<WorkflowEditorContextType | undefined>(undefined);

const AUTOSAVE_KEY = "lovable_autosave_enabled";

export const WorkflowEditorProvider = ({ children }: { children: ReactNode }) => {
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [hasConflict, setHasConflict] = useState(false);
  // const [conflictData, setConflictData] = useState<{ local: any; remote: any } | null>(null);
  const [autosaveEnabled, setAutosaveEnabledState] = useState(() => {
    try { return localStorage.getItem(AUTOSAVE_KEY) === "true" }
    catch { return false }
  });

  const setDirty = useCallback((dirty: boolean) => setIsDirty(dirty), []);
  const markDirty = useCallback(() => setIsDirty(true), []);
  const clearDirty = useCallback(() => setIsDirty(false), []);

  const setAutosaveEnabled = useCallback((enabled: boolean) => {
    setAutosaveEnabledState(enabled);
    try { localStorage.setItem(AUTOSAVE_KEY, String(enabled)) } 
    catch (e) { console.error("Failed to save autosave preference"); }
    toast.success(enabled ? "Autosave enabled" : "Autosave disabled");
  }, []);

  // beforeunload handler
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !autosaveEnabled) {
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, autosaveEnabled]);

  return (
    <WorkflowEditorContext.Provider
      value={{
        isDirty,
        setDirty,
        markDirty,
        clearDirty,
        lastSavedAt,
        hasConflict,
        // conflictData,
        setHasConflict,
        setLastSavedAt,
        // setConflictData,
        autosaveEnabled,
        showUnsavedModal,
        pendingNavigation,
        setAutosaveEnabled,
        setShowUnsavedModal,
        setPendingNavigation,
      }}
    >
      {children}
    </WorkflowEditorContext.Provider>
  );
};

export const useWorkflowEditor = () => {
  const context = useContext(WorkflowEditorContext);
  if (!context) {
    throw new Error("useWorkflowEditor must be used within a WorkflowEditorProvider");
  }
  return context;
};
