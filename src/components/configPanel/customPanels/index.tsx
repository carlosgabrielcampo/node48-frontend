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
    "conditional_operation": (stateConfig, setConfig) => <ConditionConfigPanel stateConfig={stateConfig} setConfig={setConfig} />,
    "api_call": (stateConfig, setConfig) => <ApiConfigPanel stateConfig={stateConfig} setConfig={setConfig} />,
    "loop_operation": (stateConfig, setConfig)  => <LoopConfigPanel stateConfig={stateConfig} setConfig={setConfig}/>,
    "read_csv": (stateConfig, setConfig)  => <CsvConfigPanel stateConfig={stateConfig} setConfig={setConfig} />
}