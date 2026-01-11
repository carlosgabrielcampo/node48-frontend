# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/427a01ba-7c3a-400a-b641-d3565a1ab733

# NODE48 Frontend

NODE48 Frontend is a modern React + TypeScript UI for building, editing, and orchestrating node-based workflows. It provides a drag-and-drop flow editor, reusable node templates, environment management, import/export tooling, and pluggable storage adapters.

## Key features

- Visual flow editor with node templates and edge management
- Component-driven UI using Tailwind and shadcn-ui primitives
- Environment modal and runtime configuration support
- Workflow import/export and storage adapters (local & remote)
- Auth-ready services and modular architecture for easy integration

## Tech stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui

## Quickstart

```bash
npm install
npm run dev

# Build and preview production bundle
npm run build
npm run preview
```

## Storage & database note

This repository does not include a direct connection to a production database. Workflows are currently persisted via local adapters and optional remote storage abstractions located in the `services/workflow` folder. Database-backed persistence (e.g., PostgreSQL, MongoDB, or managed cloud storage) is a planned future feature and will be added as a configurable storage adapter so the UI can be connected to your preferred backend.

If you'd like, I can scaffold a simple API and database adapter (Express + SQLite/Postgres) to demonstrate end-to-end persistence. Ask me to add it and I'll create the minimal server and adapter.

## Where to look in the codebase

- UI components: `src/components` and `src/components/ui`
- Workflow editor and nodes: `src/components/workflow` and `src/components/nodes`
- Services and storage adapters: `src/services/workflow` and `src/services/env`
- Context providers: `src/contexts`

