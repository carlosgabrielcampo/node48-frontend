import { Http2ServerResponse } from 'http2';
import { v4 as uuidv4 } from 'uuid'

// Mock workflow service
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  createdAtUTC?: string;
  updatedAtUTC?: string;
}

// Mock API functions
export const workflowService = {
  getWorkflows: async (): Promise<Workflow[]> => {
    // Simulate API delay
    const response = await fetch('http://localhost:4014/v1/workflows');
    const workflows = await response.json();
    return [...workflows];
  },

  getWorkflow: async (id: string): Promise<Workflow | null> => {
    try {
      const response = await fetch(`http://localhost:4014/v1/workflows/${id}`);
      const workflow = await response.json();
      return workflow || null;
    } catch (error) {
      console.error(error)
      return null;
    }
  },

  createWorkflow: async (data: { name: string; description?: string }): Promise<Workflow> => {
    try {
      const now = new Date().toISOString();
      const newWorkflow: Workflow = {
        id: uuidv4(),
        name: data.name,
        description: data.description,
        createdAtUTC: now,
        updatedAtUTC: now,
      };
      
      return newWorkflow;
    } catch (error) {
      console.error(error)
      throw error;
    }
  },

  saveWorkflow: async (workflow: Workflow): Promise<Response> => {
    return await fetch(`http://localhost:4014/v1/workflows/${workflow.id}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(workflow)
    });
  },

  deleteWorkflow: async (id: string): Promise<void> => {
    await fetch(`http://localhost:4014/v1/workflows/${id}`, {
      method: 'DELETE',
    });
  },
};
