import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

// Mock workflow service
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  createdAtUTC: string;
  updatedAtUTC: string;
  path: string;
}

// Mock API functions
export const workflowService = {
  getWorkflows: async (): Promise<Workflow[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    const response = await fetch('http://localhost:4014/v1/workflows');
    console.log({getWorkflows: response})

    const mockWorkflows = await response.json();
    return [...mockWorkflows];
  },

  getWorkflow: async (id: string): Promise<Workflow | null> => {
    try {
      const response = await fetch(`http://localhost:4014/v1/workflow/${id}`);
      const mockWorkflows = await response.json();
      return mockWorkflows || null;
    } catch (error) {
      console.error(error)
    }
  },

  createWorkflow: async (data: { name: string; description?: string }): Promise<Workflow> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      const now = new Date().toISOString();
      const response = await fetch('http://localhost:4014/v1/workflows');
      console.log({createWorkflow: response})
      const mockWorkflows = await response.json();

      const newWorkflow: Workflow = {
          id: uuidv4(),
          name: data.name,
          description: data.description,
          createdAtUTC: now,
          updatedAtUTC: now,
          path: `./src/test/${data.name}.json`
        };
        mockWorkflows.push(newWorkflow);
        return newWorkflow;

    } catch (error) {
      console.error(error)
    }
  
  },

  deleteWorkflow: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const response = await fetch('http://localhost:4014/v1/workflows');
      console.log({deleteWorkflow: response})
    let mockWorkflows = await response.json();
    mockWorkflows = mockWorkflows.filter((w) => w.id !== id);
  },
};
