import { useAuth } from "@/contexts/AuthContext";
import { LocalWorkflowStorage } from "./LocalWorkflowStorage";
import { RemoteWorkflowStorage } from "./RemoteWorkflowStorage";
import { WorkflowStorageInterface } from "./WorkflowStorageTypes";
const isProd = import.meta.env.PROD;

export const workflowService: WorkflowStorageInterface = new LocalWorkflowStorage()
  // ? new RemoteWorkflowStorage()
  // : new LocalWorkflowStorage();