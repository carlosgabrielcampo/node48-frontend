export type StatCard = {
  id: string;
  title: string;
  value: string;
  trendPct: number;
  trendUp: boolean;
  icon: 'flow' | 'play' | 'clock' | 'server' | 'env' | 'exclamation';
};

export type WorkflowRow = {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  lastRun: Date;
  environment: 'prod' | 'staging' | 'dev';
};

export type ActivityItem = {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'update';
  timestamp: Date;
};

export const stats: StatCard[] = [
  { id: 's1', title: 'Total workflows', value: '24', trendPct: 6.4, trendUp: true, icon: 'flow' },
  { id: 's2', title: 'Active workflows', value: '18', trendPct: -2.1, trendUp: false, icon: 'play' },
  { id: 's3', title: "Executions today", value: '142', trendPct: 12.7, trendUp: true, icon: 'clock' },
  { id: 's4', title: 'Failed executions', value: '3', trendPct: -25, trendUp: true, icon: 'exclamation' },
  { id: 's5', title: 'Environments', value: '4', trendPct: 0, trendUp: true, icon: 'env' },
  { id: 's6', title: 'Avg exec time', value: '1.2s', trendPct: -4.3, trendUp: true, icon: 'clock' },
];

// generate a few recent dates for the mock rows
const now = Date.now();
const minutes = (n: number) => new Date(now - n * 60 * 1000);
const hours = (n: number) => new Date(now - n * 60 * 60 * 1000);

export const workflows: WorkflowRow[] = [
  { id: 'w1', name: 'CSV Import Flow', status: 'Active', lastRun: minutes(5), environment: 'prod' },
  { id: 'w2', name: 'Image Resizer', status: 'Active', lastRun: minutes(30), environment: 'staging' },
  { id: 'w3', name: 'Daily Reports', status: 'Inactive', lastRun: hours(20), environment: 'prod' },
  { id: 'w4', name: 'User Onboarding', status: 'Active', lastRun: hours(2), environment: 'dev' },
  { id: 'w5', name: 'Cleanup Job', status: 'Inactive', lastRun: hours(48), environment: 'prod' },
  { id: 'w6', name: 'CSV Flow', status: 'Active', lastRun: minutes(120), environment: 'staging' },
];

export const activities: ActivityItem[] = [
  { id: 'a1', message: "Workflow 'CSV Flow' executed successfully.", type: 'success', timestamp: minutes(10) },
  { id: 'a2', message: "Environment 'staging' variables updated.", type: 'update', timestamp: hours(1) },
  { id: 'a3', message: "Workflow 'Daily Reports' published.", type: 'info', timestamp: hours(3) },
  { id: 'a4', message: "Failed execution on 'Image Resizer'.", type: 'warning', timestamp: minutes(90) },
  { id: 'a5', message: "New environment 'qa' created.", type: 'info', timestamp: hours(6) },
];

export const systemStatus = {
  ok: true,
  uptimePct: 99.98,
  region: 'us-west-2',
};
