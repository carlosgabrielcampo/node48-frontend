import assert from 'assert'
import { ApiConfigPanel } from './customPanels/ApiConfigPanel'
import { ConditionConfigPanel } from './customPanels/ConditionConfigPanel'
import { CsvConfigPanel } from './customPanels/CsvConfigPanel'
import { LoopConfigPanel } from './customPanels/LoopConfigPanel'
import React, { Dispatch, SetStateAction } from 'react'

type PanelFactory = (
    state: any[],
    setState: (updates: any[]) => void,
    registerCommit: (fn: () => void) => void,
    open: boolean,
    defaultObject: any
) => JSX.Element

export const parametersPanels: Record<string, PanelFactory>  = {
    "conditional_operation": (state, setState, registerCommit, open, defaultPanelInfo) => 
        <ConditionConfigPanel 
            state={state} 
            setState={setState} 
            registerCommit={registerCommit} 
            open={open}
            defaultPanelInfo={defaultPanelInfo}
        />,
    "api_call": (state, setState, registerCommit, open, defaultPanelInfo) => 
        <ApiConfigPanel  
            state={state} 
            setState={setState} 
            registerCommit={registerCommit} 
            open={open}
            defaultPanelInfo={defaultPanelInfo}
        />,
    "loop_operation": (state, setState, registerCommit, open, defaultPanelInfo)  => 
        <LoopConfigPanel  
            state={state} 
            setState={setState} 
            registerCommit={registerCommit} 
            open={open}
            defaultPanelInfo={defaultPanelInfo}
        />,
    "read_csv": (state, setState, registerCommit, open, defaultPanelInfo) => 
        <CsvConfigPanel  
            state={state} 
            setState={setState} 
            registerCommit={registerCommit} 
            open={open}
            defaultPanelInfo={defaultPanelInfo}
        />
}
