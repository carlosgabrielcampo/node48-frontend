import assert from 'assert'
import { ApiConfigPanel, ConfigPanel } from './customPanels/ApiConfigPanel'
import { ConditionConfigPanel } from './customPanels/ConditionConfigPanel'
import { CsvConfigPanel } from './customPanels/CsvConfigPanel'
import { LoopConfigPanel } from './customPanels/LoopConfigPanel'

interface PanelFactory {
    draft: any[];
    setDraft: (updates: any[]) => void;
    registerCommit: (fn: () => void) => void;
    open: boolean;
    defaultObject: any
}

export const parametersPanels: Record<string, PanelFactory>  = {
    "conditional_operation": ({draft, setDraft, registerCommit, open, panelInfo, panelFormat}: PanelFactory) => 
        <ConditionConfigPanel 
            open={open}
            draft={draft} 
            setDraft={setDraft} 
            panelInfo={panelInfo}
            panelFormat={panelFormat}
            registerCommit={registerCommit} 
        />,
    "api_call": ({draft, setDraft, registerCommit, open, panelInfo, panelFormat}: PanelFactory) => 
        <ConfigPanel  
            open={open}
            draft={draft}
            setDraft={setDraft} 
            panelInfo={panelInfo}
            panelFormat={panelFormat}
            registerCommit={registerCommit} 
        />,
    "loop_operation": ({draft, setDraft, registerCommit, open, panelInfo, panelFormat}: PanelFactory)  => 
        <LoopConfigPanel  
            draft={draft} 
            setDraft={setDraft} 
            registerCommit={registerCommit} 
            open={open}
            panelInfo={panelInfo}
        />,
    "read_csv": ({draft, setDraft, registerCommit, open, panelInfo, panelFormat}: PanelFactory) => 
        <CsvConfigPanel  
            draft={draft} 
            setDraft={setDraft} 
            registerCommit={registerCommit} 
            open={open}
            panelInfo={panelInfo}
        />
    
}
