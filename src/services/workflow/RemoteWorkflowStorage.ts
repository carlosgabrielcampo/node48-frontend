import { v4 as uuidv4 } from 'uuid'
import { WorkflowInterface, WorkflowStorageInterface } from './WorkflowStorageTypes';

export class RemoteWorkflowStorage implements WorkflowStorageInterface {
  async getAll(): Promise<WorkflowInterface[]> {
    const res = await fetch("http://localhost:4014/v1/workflows");
    return await res.json();
  }

  async getById(id: string): Promise<WorkflowInterface | null> {
    try {
      const res = await fetch(`http://localhost:4014/v1/workflows/${id}`);
      return await res.json();
    } catch {
      return null;
    }
  }

  async create(data: { name: string; description?: string }): Promise<WorkflowInterface> {
    const now = new Date().toISOString();
    return {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      createdAtUTC: now,
      updatedAtUTC: now,
      steps: [],
    };
  }

  async save(workflow: WorkflowInterface): Promise<void> {
    const res = await fetch(
      `http://localhost:4014/v1/workflows/${workflow.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workflow),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to save workflow");
    }
  }

  async delete(id: string): Promise<void> {
    await fetch(`http://localhost:4014/v1/workflows/${id}`, {
      method: "DELETE",
    });
  }
}