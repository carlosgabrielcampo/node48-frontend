import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { RunningModal } from '../../../../components/panels/RunningPanel'
import { PropsWithChildren, ReactPortal } from 'react'

// Mock the useEnv hook
vi.mock('@/contexts/EnvContext', () => ({
  useEnv: () => ({
    getActiveEnvs: vi.fn().mockResolvedValue({
      profileGlobal: { values: { globalVar: 'globalValue' } },
      profileActive: { values: { activeVar: 'activeValue' } }
    })
  }),
  EnvProvider: ({ children }: PropsWithChildren) => <div>{children}</div>
}))

// Mock the services
vi.mock('@/services/workflow/WorkflowService', () => ({
  workflowService: {
    getById: vi.fn()
  }
}))

vi.mock('@/services/env/envService', () => ({
  envService: {}
}))

// Mock the layout components
vi.mock('../layout/dialog', () => ({
  DialogLayout: ({ children, open, dialogTitle, dialogDescription }: {children: ReactPortal, open: boolean, dialogTitle: ReactPortal, dialogDescription: ReactPortal }) =>
    open ? (
      <div data-testid="dialog">
        <h2>{dialogTitle}</h2>
        <p>{dialogDescription}</p>
        {children}
      </div>
    ) : null
}))

vi.mock('../layout/textArea', () => ({
  CodeTextarea: ({ value, label, disabled }: {value: string, label: string, disabled: boolean}) => (
    <div data-testid="code-textarea">
      <label>{label}</label>
      <pre>{JSON.stringify(value, null, 2)}</pre>
    </div>
  )
}))

vi.mock('@/components/ui/scroll-area', () => ({
  ScrollArea: ({ children }: PropsWithChildren) => <div data-testid="scroll-area">{children}</div>
}))

describe('RunningModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when open is false', () => {
    render(<RunningModal open={false} workflowId="test-id" onOpenChange={() => {}} />)

    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument()
  })

  it('should render when open is true and data is loaded', async () => {
    // Mock the workflow service response
    const mockGetById = vi.fn().mockResolvedValue({
      steps: {
        step1: { id: 'step1', name: 'Step 1' },
        step2: { id: 'step2', name: 'Step 2' }
      }
    })

    // Import and mock the service
    const { workflowService } = await import('@/services/workflow/WorkflowService')
    workflowService.getById = mockGetById

    render(<RunningModal open={true} workflowId="test-id" onOpenChange={() => {}} />)

    await waitFor(() => {
      expect(screen.getByTestId('dialog')).toBeInTheDocument()
    })

    expect(screen.getByText('Running...')).toBeInTheDocument()
    expect(screen.getByText('Project Running with the following configurations')).toBeInTheDocument()
    expect(screen.getAllByTestId('code-textarea')).toHaveLength(2)
  })
})