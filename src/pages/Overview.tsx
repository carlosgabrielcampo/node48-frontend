import React, { useState } from 'react';
import { stats, workflows, activities, systemStatus } from '../lib/mockOverviewData';
import { LabeledDropdown } from '@/components/layout/dropdown';
interface StatCardInterface {
  title: string;
  value: string;
  trendPct: number;
  trendUp: boolean;
  icon: string;
}

const Icon = ({ name }: { name: string }) => {
  switch (name) {
    case 'flow':
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M3 12h6l2 2 4-4 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'play':
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 3v18l15-9L5 3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );
    case 'clock':
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
          <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'exclamation':
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );
    case 'env':
      return (
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7 7V5a5 5 0 0110 0v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};

function timeAgo(d: Date) {
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}

const StatCard = ({ title, value, trendPct, trendUp, icon }: StatCardInterface) => (
  <article
    role="group"
    aria-label={title}
    className="flex items-start gap-4 rounded-lg bg-card/40 p-4 shadow-sm ring-1 ring-border"
  >
    <div className=" space-y-2">
      <div className='flex w-full gap-2'>
        <div className="rounded-md bg-muted p-2 text-muted-foreground ">
          <Icon name={icon} />
        </div>
        <p className="text-sm text-muted-foreground">{title}</p>
      </div>
      <div className="mt-1 flex items-baseline gap-3">
        <h3 className="text-2xl font-semibold">{value}</h3>
        <span
          className={`text-sm font-medium ${trendUp ? 'text-success' : 'text-red-500'}`}
          aria-hidden
        >
          {trendUp ? '↑' : '↓'} {Math.abs(trendPct)}%
        </span>
      </div>
    </div>
  </article>
);

const Overview: React.FC = () => {
  const [dateDropdown, setDateDropdown] = useState("Last 7 days")
  return (
    <div>
      <main className="min-h-screen bg-background/60 px-4 py-8 text-sm text-foreground">
        <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Overview</h1>
            <p className="text-muted-foreground">Summary of your workflows and activity</p>
          </div>
          <div className="mt-3 md:mt-0 flex items-center gap-3">
            <LabeledDropdown onSelect={({value}) => setDateDropdown(value)} header={dateDropdown} options={[{display: "Last 24 hours", itemProperties: {value: "Last 24 hours"}}, {display: "Last 7 days", itemProperties: {value: "Last 7 days"}}, {display: "Last 30 days", itemProperties: {value: "Last 30 days"}} ]} /> 
          </div>
        </header>

        <section aria-labelledby="stats" className="mb-6">
          <h2 id="stats" className="sr-only">Key statistics</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {stats.map((s) => (
              <StatCard key={s.id} title={s.title} value={s.value} trendPct={s.trendPct} trendUp={s.trendUp} icon={s.icon} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2">
            <div className="rounded-lg bg-card/40 p-4 shadow-sm ring-1 ring-border">
              <header className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Workflows</h3>
                <p className="text-sm text-muted-foreground">Recent runs and status</p>
              </header>

              <div className="flow-root">
                <table className="w-full table-fixed text-left">
                  <thead className="text-xs text-muted-foreground">
                    <tr>
                      <th className="w-1/2 py-2">Name</th>
                      <th className="w-1/6 py-2">Status</th>
                      <th className="w-1/6 py-2">Last run</th>
                      <th className="w-1/6 py-2">Environment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {workflows.map((w) => (
                      <tr key={w.id} className="hover:bg-muted/20">
                        <td className="py-3 pr-4">
                          <div className="font-medium">{w.name}</div>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              w.status === 'Active' ? 'bg-success text-primary-text-color' : 'bg-warning text-primary-text-color'
                            }`}
                          >
                            {w.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{timeAgo(w.lastRun)}</td>
                        <td className="py-3 pr-4">
                          <span className="rounded px-2 py-0.5 text-xs bg-muted text-muted-foreground">{w.environment}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-lg bg-card/40 p-4 shadow-sm ring-1 ring-border">
              <h3 className="mb-2 text-lg font-semibold">Recent activity</h3>
              <ul className="space-y-3">
                {activities.map((a) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <span aria-hidden className="mt-1 block rounded-md bg-muted p-2 text-muted-foreground">
                      {a.type === 'success' ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : a.type === 'warning' ? (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><path d="M12 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                      ) : (
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2"/></svg>
                      )}
                    </span>
                    <div>
                      <div className="text-sm">{a.message}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{timeAgo(a.timestamp)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-card/40 p-4 shadow-sm ring-1 ring-border">
              <h3 className="text-lg font-semibold">System status</h3>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="font-medium">{systemStatus.ok ? 'All systems operational' : 'Partial outage'}</p>
                  <p className="text-sm text-muted-foreground">Uptime: {systemStatus.uptimePct}%</p>
                </div>
                <div className="text-sm text-muted-foreground">Region: {systemStatus.region}</div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Overview;
