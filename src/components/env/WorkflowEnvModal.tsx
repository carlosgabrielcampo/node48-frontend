import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Workflow } from "lucide-react";
import { useEnv } from "@/contexts/EnvContext";
import { EnvProfile, EnvValues } from "@/types/env";
import { toast } from "sonner";
import { DialogLayout } from "../layout/dialog";
import { TabLayout } from "../layout/tabs";
import { ProfileTab } from "./ProfileTab";
import { ActiveTab } from "./ActiveTab";
import { UnsavedChangesModal } from "../layout/modal";

interface WorkflowEnvModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string;
}

export const WorkflowEnvModal = ({ open, onOpenChange, workflowId }: WorkflowEnvModalProps) => {
  const { getActiveEnvs, loadWorkflowEnvs, setWorkflowActiveEnv } = useEnv();
  const [activeGlobal, setActiveGlobal] = useState({})
  const [activeLocal, setActiveLocal] = useState({})
  
  useEffect(() => {
    if (open && workflowId) { 
      updateActiveEnvs();
      loadWorkflowEnvs(workflowId);
    }
  }, [open, workflowId, loadWorkflowEnvs]);

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  const updateActiveEnvs = () => {
    getActiveEnvs({id: workflowId}).then(({profileGlobal, profileActive}) => {
      console.log({profileGlobal, profileActive})
      setActiveGlobal({ ...profileGlobal, scope: "global" })
      setActiveLocal({ ...profileActive, scope: "workflow" })
    })
  }

  const handleEnvSwitch = useCallback(async (envId: string | null, type: "workflow" | "global") => {
    if(!envId || !type) return null
    await setWorkflowActiveEnv(workflowId, envId, type);
    updateActiveEnvs();
  }, [workflowId, setWorkflowActiveEnv]);

  return (
    <DialogLayout 
      open={open} 
      handleClose={handleClose} 
      classes={{contentClass: "max-w-4xl min-h-[65vh] max-h-[85vh] flex flex-col"}}
      dialogTitle={
        <div className="flex items-center gap-2">
          <Workflow className="h-5 w-5"/>
          Workflow Environment Configuration
        </div>
      }
      dialogDescription="Configure environment variables for this workflow. Workflow overrides take precedence over project defaults."
      dialogFooter={<></>}
    >
      <TabLayout tabs={[
          {
            value: "active",
            trigger: "Active Environment",
            class: "flex-1 space-y-4 mt-4",
            content: ActiveTab({
              workflowId,
              activeLocal,
              activeGlobal,
              setActiveLocal,
              handleEnvSwitch,
              setActiveGlobal,
            }),
            onClick: () => updateActiveEnvs()
          },
          {
            value: "profiles",
            trigger: "Workflow Profiles",
            class: "flex-1 flex flex-col h-full mt-4",
            content: ProfileTab({
              workflowId,
              activeLocal,
              handleEnvSwitch, 
              updateActiveEnvs,
            }),
          }
      ]}/>
    </DialogLayout>
  );
};