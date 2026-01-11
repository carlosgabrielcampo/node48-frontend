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

  console.log({writeAll: workflows})
  console.log(`${auth_token}:${STORAGE_KEY}`,  JSON.stringify(workflows))
  
  localStorage.setItem(`${auth_token}:${STORAGE_KEY}`, JSON.stringify(workflows));
};


export class LocalWorkflowStorage implements WorkflowStorageInterface {
  async getAll(): Promise<WorkflowInterface[]> {
    return readAll();
  }

  async getById(id: string): Promise<WorkflowInterface | null> {
    return readAll().find(w => w.id === id) ?? null;
  }

  async create(data: { name: string; description?: string }): Promise<WorkflowInterface> {
    const now = new Date().toISOString();

    const workflow: WorkflowInterface = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      createdAtUTC: now,
      updatedAtUTC: now,
      steps: [],
    };

    const all = readAll();
    writeAll([...all, workflow]);

    return workflow;
  }

  async save(workflow: WorkflowInterface): Promise<void> {
    const all = readAll().map(w =>
      w.id === workflow.id
        ? { ...workflow, updatedAtUTC: new Date().toISOString() }
        : w
    );
    writeAll(all);
  }

  async delete(id: string): Promise<void> {
    writeAll(readAll().filter(w => w.id !== id));
  }
}
