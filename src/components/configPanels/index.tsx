import { ApiConfigPanel } from './customPanels/ApiConfigPanel'
import { ConditionConfigPanel } from './customPanels/ConditionConfigPanel'
import { CsvConfigPanel } from './customPanels/CsvConfigPanel'
import { LoopConfigPanel } from './customPanels/LoopConfigPanel'
import { ReactElement } from 'react'

type PanelFactory = (
    state: any[],
    setState: (updates: any[]) => void
 ) => ReactElement

export const parametersPanels: Record<string, PanelFactory>  = {
    "conditional_operation": (state, setState) => <ConditionConfigPanel state={state} setState={setState} />,
    "api_call": (state, setState) => <ApiConfigPanel  state={state} setState={setState} />,
    "loop_operation": (state, setState)  => <LoopConfigPanel  state={state} setState={setState} />,
    "read_csv": (state, setState)  => <CsvConfigPanel  state={state} setState={setState} />
}
