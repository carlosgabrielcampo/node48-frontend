import { v4 as uuidv4 } from 'uuid'
const STORAGE_KEY = "workflows";
const AUTH_TOKEN_KEY = "node48_auth_token";

import { WorkflowInterface, WorkflowStorageInterface } from './WorkflowStorageTypes';

const readAll = (): WorkflowInterface[] => {
  const auth_token = localStorage.getItem(AUTH_TOKEN_KEY)
  const raw = localStorage.getItem(`${auth_token}:${STORAGE_KEY}`);
  return raw ? JSON.parse(raw) : [];
};

const writeAll = (workflows: WorkflowInterface[]) => {
  const auth_token = localStorage.getItem(AUTH_TOKEN_KEY)
  localStorage.setItem(`${auth_token}:${STORAGE_KEY}`, JSON.stringify(workflows));
  return workflows
};


export class LocalWorkflowStorage implements WorkflowStorageInterface {
  async getAll(): Promise<WorkflowInterface[]> {
    return readAll();
  }

  async getById(id: string): Promise<WorkflowInterface | null> {
    return readAll().find(w => w.id === id) ?? null;
  }

  async create(data): Promise<WorkflowInterface> {
    const now = new Date().toISOString();

    const workflow: WorkflowInterface = {
      name: '',
      description: '',
      steps: [],
      ...data,
      createdAtUTC: now,
      updatedAtUTC: now,
      id: uuidv4(),
    };

    const all = readAll();
    writeAll([...all, workflow]);

    return workflow;
  }

  async update(data: Partial<WorkflowInterface>): Promise<WorkflowInterface> {
    if(!data.id) return null
    const allWorkflows = readAll()
    const foundWorkflowData = allWorkflows.find(w => w.id === data.id) ?? null
    if(!foundWorkflowData) return null
    
    const all = allWorkflows.map((w) => {
      return  w.id === foundWorkflowData.id ? { ...foundWorkflowData, ...data, updatedAtUTC: new Date().toISOString()} : w 
    })
    return writeAll(all);
  }

  async save(workflow: WorkflowInterface): Promise<WorkflowInterface[]> {
    const all = readAll().map(w =>
      w.id === workflow.id
        ? { ...workflow, updatedAtUTC: new Date().toISOString() }
        : w
    );
   return writeAll(all);
  }

  async delete(id: string): Promise<WorkflowInterface[]> {
    return writeAll(readAll().filter(w => w.id !== id));
  }
}
