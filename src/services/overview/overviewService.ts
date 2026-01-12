import {
  stats as mockStats,
  workflows as mockWorkflows,
  activities as mockActivities,
  systemStatus as mockSystemStatus,
  StatCard,
  WorkflowRow,
  ActivityItem,
} from '../../lib/mockOverviewData';

export type SystemStatus = {
  ok: boolean;
  uptimePct: number;
  region: string;
};

const simulateFetch = <T>(data: T, delay = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

export const getStats = async (): Promise<StatCard[]> => {
  return simulateFetch<StatCard[]>(mockStats);
};

export const getWorkflows = async (): Promise<WorkflowRow[]> => {
  // const res = await fetch('/api/workflows?limit=50');
  // return (await res.json()) as WorkflowRow[];
  return simulateFetch<WorkflowRow[]>(mockWorkflows);
};

/**
 * Fetch recent activity (mock)
 */
export const getActivities = async (): Promise<ActivityItem[]> => {
  // const res = await fetch('/api/activities');
  // return (await res.json()) as ActivityItem[];
  return simulateFetch<ActivityItem[]>(mockActivities);
};

export const getSystemStatus = async (): Promise<SystemStatus> => {
  // const res = await fetch('/api/system/status');
  // return (await res.json()) as SystemStatus;
  return simulateFetch<SystemStatus>(mockSystemStatus as SystemStatus);
};

const overviewService = {
  getStats,
  getWorkflows,
  getActivities,
  getSystemStatus,
};

export default overviewService;
