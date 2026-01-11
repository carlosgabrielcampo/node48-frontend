export interface WorkflowInterface {
  id: string;
  name: string;
  description?: string;
  createdAtUTC?: string;
  updatedAtUTC?: string;
  steps: Record<string, any>;
}

export interface WorkflowStorageInterface {
  getAll(): Promise<WorkflowInterface[]>;
  getById(id: string): Promise<WorkflowInterface | null>;
  create(data: Partial<WorkflowInterface>): Promise<WorkflowInterface>;
  save(workflow: WorkflowInterface): Promise<WorkflowInterface[]>;
  update(workflow: Partial<WorkflowInterface>): Promise<WorkflowInterface[]>;
  delete(id: string): Promise<void>;
}