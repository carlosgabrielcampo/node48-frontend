// Mock workflow service
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  createdAtUTC: string;
  updatedAtUTC: string;
}

// Mock data storage
let mockWorkflows: Workflow[] = [
  {
    id: "173b9358-b6f6-49f6-8bdc-9dbacadd8147",
    name: "Sample Workflow",
    description: "A sample workflow with CSV processing and API calls",
    createdAtUTC: "2025-09-03T12:00:00.000Z",
    updatedAtUTC: "2025-09-03T12:00:00.000Z",
  },
  {
    id: "2",
    name: "User Onboarding",
    description: "Automated user onboarding process",
    createdAtUTC: "2025-09-02T10:30:00.000Z",
    updatedAtUTC: "2025-09-02T10:30:00.000Z",
  },
  {
    id: "3",
    name: "Data Sync",
    createdAtUTC: "2025-09-01T08:15:00.000Z",
    updatedAtUTC: "2025-09-01T08:15:00.000Z",
  },
];

// Mock API functions
export const workflowService = {
  getWorkflows: async (): Promise<Workflow[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...mockWorkflows];
  },

  getWorkflow: async (id: string): Promise<Workflow | null> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockWorkflows.find((w) => w.id === id) || null;
  },

  createWorkflow: async (data: { name: string; description?: string }): Promise<Workflow> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const now = new Date().toISOString();
    const newWorkflow: Workflow = {
      id: `wf-${Date.now()}`,
      name: data.name,
      description: data.description,
      createdAtUTC: now,
      updatedAtUTC: now,
    };
    mockWorkflows.push(newWorkflow);
    return newWorkflow;
  },

  deleteWorkflow: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    mockWorkflows = mockWorkflows.filter((w) => w.id !== id);
  },
};
