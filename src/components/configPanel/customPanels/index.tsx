import { NodeType } from '@/types/node'
import { ApiConfigPanel } from './ApiConfigPanel'
import { ConditionConfigPanel } from './ConditionConfigPanel'
import { CsvConfigPanel } from './CsvConfigPanel'
import { LoopConfigPanel } from './LoopConfigPanel'
import { WorkflowNode } from '@/types/configPanels'
import { ReactElement } from 'react'
type PanelFactory = (
    node: WorkflowNode,
    handleUpdate: (updates: Partial<WorkflowNode>) => void
 ) => ReactElement

export const parametersPanels: Record<string, PanelFactory>  = {
    "conditional_operation": (configRef, setConfig) => <ConditionConfigPanel stateConfig={configRef} setConfig={setConfig} />,
    "api_call": (configRef, setConfig) => <ApiConfigPanel stateConfig={configRef} setConfig={setConfig} />,
    "loop_operation": (configRef, setConfig)  => <LoopConfigPanel stateConfig={configRef} setConfig={setConfig}/>,
    "read_csv": (configRef, setConfig)  => <CsvConfigPanel stateConfig={configRef} setConfig={setConfig} />
}