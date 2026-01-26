import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import App from '../App'
import { ReactPortal } from 'react'
import '@testing-library/jest-dom';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(globalThis as unknown as {
  ResizeObserver: typeof ResizeObserver;
}).ResizeObserver = ResizeObserverMock;

// Mock all the providers and components to avoid complex setup
vi.mock('@/contexts/ThemeContext', () => ({
  ThemeProvider: ({ children }: ReactPortal) => <div data-testid="theme-provider">{children}</div>
}))

vi.mock('@/contexts/AuthContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/contexts/AuthContext')>();

  return {
    ...actual,
    AuthProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="auth-provider">{children}</div>
    ),
    useAuth: () => ({
      login: vi.fn(),
      loginWithGoogle: vi.fn(),
      isLoading: false,
      error: null,
      user: null,
      logout: vi.fn(),
    }),
  };
});

vi.mock('@/contexts/EnvContext', () => ({
  EnvProvider: ({ children }: ReactPortal) => <div data-testid="env-provider">{children}</div>
}))

vi.mock('@/contexts/WorkflowEditorContext', () => ({
  WorkflowEditorProvider: ({ children }: ReactPortal) => <div data-testid="workflow-provider">{children}</div>
}))

vi.mock('@/components/ui/toaster', () => ({
  Toaster: () => <div data-testid="toaster" />
}))

vi.mock('@/components/ui/sonner', () => ({
  Toaster: () => <div data-testid="sonner" />
}))

vi.mock('@/components/ui/tooltip', () => ({
  TooltipProvider: ({ children }: ReactPortal) => <div data-testid="tooltip-provider">{children}</div>
}))

vi.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: ReactPortal) => <div data-testid="sidebar-provider">{children}</div>
}))

vi.mock('@/components/auth/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: ReactPortal) => <div data-testid="protected-route">{children}</div>
}))

// Mock pages
vi.mock('./pages/Login', () => ({
  default: () => <div data-testid="login-page">Login Page</div>
}))

vi.mock('./pages/Register', () => ({
  default: () => <div data-testid="register-page">Register Page</div>
}))

vi.mock('./pages/Overview', () => ({
  default: () => <div data-testid="overview-page">Overview Page</div>
}))

vi.mock('./pages/Workflows', () => ({
  default: () => <div data-testid="workflows-page">Workflows Page</div>
}))

vi.mock('./pages/WorkflowDetail', () => ({
  default: () => <div data-testid="workflow-detail-page">Workflow Detail Page</div>
}))

vi.mock('./pages/Settings', () => ({
  default: () => <div data-testid="settings-page">Settings Page</div>
}))

vi.mock('./pages/NotFound', () => ({
  default: () => <div data-testid="not-found-page">Not Found Page</div>
}))

describe('App', () => {
  it('should render without crashing', () => {
    expect(() => render(<App />)).not.toThrow()
  })

  it('should render with all providers', () => {
    render(<App />)

    expect(document.querySelector('[data-testid="theme-provider"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="auth-provider"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="env-provider"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="workflow-provider"]')).toBeInTheDocument()
  })
})