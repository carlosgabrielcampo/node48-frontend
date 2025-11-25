import { NodeType } from '@/types/node'
import { ApiConfigPanel } from './ApiConfigPanel'
import { ConditionConfigPanel } from './ConditionConfigPanel'
import { CsvConfigPanel } from './CsvConfigPanel'
import { LoopConfigPanel } from './LoopConfigPanel'
import { WorkflowNode } from '@/types/config-panels'
import { ReactElement } from 'react'
type PanelFactory = (
    node: WorkflowNode,
    handleUpdate: (updates: Partial<WorkflowNode>) => void
 ) => ReactElement

export const parametersPanels: Record<string, PanelFactory>  = {
    "conditional_operation": (node, handleUpdate) => <ConditionConfigPanel node={node} onUpdate={handleUpdate} />,
    "api_call": (node, handleUpdate) => <ApiConfigPanel node={node} onUpdate={handleUpdate} />,
    "loop_operation": (node, handleUpdate)  => <LoopConfigPanel node={node} onUpdate={handleUpdate} />,
    "read_csv": (node, handleUpdate)  => <CsvConfigPanel node={node} onUpdate={handleUpdate} />
}