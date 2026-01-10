import { LocalWorkflowStorage } from "./LocalWorkflowStorage";
import { RemoteWorkflowStorage } from "./RemoteWorkflowService";
import { WorkflowStorageInterface } from "./types";
const isProd = import.meta.env.PROD;


export const workflowService: WorkflowStorageInterface = isProd
  ? new RemoteWorkflowStorage()
  : new LocalWorkflowStorage();