import { useCallback, useEffect, useState } from "react"
import { DialogLayout } from "../layout/dialog"
import { workflowService } from "@/services/workflow/WorkflowService"
import { CodeTextarea } from "../layout/textArea"
import { ScrollArea } from "../ui/scroll-area"
import { envService } from "@/services/env/envService"
import { useEnv } from "@/contexts/EnvContext"

export const RunningModal = ({onOpenChange, open, workflowId}) => {
    const { getActiveEnvs } = useEnv()
    const [runningWorkflow, setRunningWorkflow] = useState([])
    const [workflowEnvs, setWorkflowEnvs] = useState({})
    
    const getWorkflow = async () => {
        getActiveEnvs({id: workflowId}).then((e) => setWorkflowEnvs({values: {...e?.profileGlobal?.values, ...e?.profileActive?.values}}))
    }

    const getEnvs = async () => {
        workflowService.getById(workflowId).then((e) => setRunningWorkflow([...Object.values(e.steps)]))
    }

    useEffect(() => {
        if(open){ getWorkflow(); getEnvs(); }
    }, [open])
    
    return (
        <DialogLayout 
            handleClose={(e) => {onOpenChange(e); setRunningWorkflow([]); setWorkflowEnvs([])}} 
            classes={{contentClass: "h-[80vh]"}}
            open={runningWorkflow.length && workflowEnvs.values && open}
            dialogTitle={"Running..."}
            dialogDescription={"Project Running with the following configurations"}   
        >
            <ScrollArea>
                <div className="h-full flex flex-col gap-10">
                    <div className="">
                        <CodeTextarea disabled value={runningWorkflow} label={"Workflow:"} />
                    </div>
                    <div>
                        <CodeTextarea disabled value={workflowEnvs} label={"Environment:"} />
                    </div>
                </div>
            </ScrollArea>
        </DialogLayout>
    )
}