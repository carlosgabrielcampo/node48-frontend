import { ApiConfigPanelProps, ApiConfig } from "@/types/panels";
import { LabeledDropdown } from "../../layout/dropdown";
import { CodeTextarea } from "@/components/layout/textArea";
import { KeyValueInput, LabeledInput } from "@/components/layout/input";
import { LabeledCard } from "@/components/layout/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { UUID } from "crypto";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ObjectRow {
  id: UUID,
  key: string,
  value: string
}

type RendererProps = {
  draft: Record<string, any>;
  schema: Record<string, any>;
  setDraft?: (v: Record<string, any>) => void;
  addOption?: (v: Record<string, any>) => void;
  removeOption?: (v: Record<string, any>) => void;
  registerCommit: (bind: string, v: Record<string, any>) => void;
};

type ChildrenRender = {
  draft: Record<string, any>;
  children: Record<string, any>;
  setDraft?: (v: Record<string, any>) => void;
  addOption?: (v: Record<string, any>) => void;
  removeOption?: (v: Record<string, any>) => void;
  registerCommit: (bind: string, v: Record<string, any>) => void;
};

const ChildrenRender = ({draft, setDraft, children, addOption, removeOption, registerCommit, open}: ChildrenRender) => 
  children?.length && children.map((child: any, i: number) => (
      <RenderSchema
        schema={child}
        draft={draft}
        setDraft={setDraft}
        addOption={addOption}
        removeOption={removeOption}
        registerCommit={registerCommit}
      />
    )
)

export function RenderSchema({ schema, draft, setDraft, addOption, removeOption, registerCommit }: RendererProps) {
  if (!schema) return null;
  const childrenRenderObject = schema.children 
    ? <ChildrenRender
        draft={draft}
        setDraft={setDraft}
        addOption={addOption}
        children={schema.children}
        removeOption={removeOption}
        registerCommit={registerCommit}
      />
    : <></>

  const headRenderObject = schema.header 
    ? <ChildrenRender
      draft={draft}
      setDraft={setDraft}
      addOption={addOption}
      children={schema.header}
      removeOption={removeOption}
      registerCommit={registerCommit}
    />
    : <></>
  
  switch (schema.component) {
    case "LabeledInput": {
      return (
        <LabeledInput
          key={schema.label}
          label={schema.label}
          placeholder={schema.placeholder}
          value={draft?.[schema.bind] ?? ""}
          onChange={({target: {value}}) => setDraft({ ...draft, [schema?.bind]: value })}
          registerCommit={registerCommit}
        >
          {childrenRenderObject}
        </LabeledInput>
      );
    }
    case "LabeledDropdown": {
      return (
        <LabeledDropdown
          label={schema.label}
          options={schema.options}
          menuLabel={schema.menuLabel}
          header={draft?.[schema.bind]}
          dropdownExtra={schema.dropdownExtra}
          onSelect={({value}) => setDraft({ ...draft, [schema.bind]: value })}
          registerCommit={registerCommit}
        >
          {childrenRenderObject}
        </LabeledDropdown>
      );
    }
    case "LabeledCard": {
      return (
        <LabeledCard label={schema.label} header={headRenderObject}>{childrenRenderObject}</LabeledCard>
      );
    }
    case "CodeTextarea": {
      return (
        <CodeTextarea
          state={draft}
          key={schema.bind}
          bind={schema.bind}
          setDraft={setDraft}
          value={draft?.[schema.bind]}
          registerCommit={registerCommit}
        > 
          {childrenRenderObject}
        </CodeTextarea>
      );
    }
    case "KeyValueList": {
      return <KeyValueInput
          bind={schema.bind}
          value={draft?.[schema.bind]} 
          registerCommit={registerCommit} 
        />
    }
    case "AddOptions": {
      return (
        <Button onClick={addOption} size="sm" variant="outline">
            <Plus className="h-4 w-4" />
            {schema.label}
        </Button>
      )
    }
    case "DeleteButton": {
      return (
        <Button onClick={() => removeOption(draft.nextStepId)} size="sm" variant="ghost">
            <Trash2 className="h-4 w-4"  />
        </Button>
      )
    }
    case "SwitchableChildren": {
      const schemaSelected = schema.switch.find((e) => e.key === draft?.[schema.bind])
      return (
        <RenderSchema
          draft={draft} 
          setDraft={setDraft} 
          addOption={addOption}
          schema={schemaSelected}
          removeOption={removeOption}
          registerCommit={registerCommit}
        />
      )
    }
    default:
      return <></>;
  }
}

export const ConfigPanel = ({open, draft, setDraft, registerCommit, panelInfo, panelFormat}: ApiConfigPanelProps) => {
  const [panelConfig, setPanelConfig] = useState([]) 
  useEffect(
    () => {
      console.log({panelConfig})
      if(panelConfig?.length){
        setDraft(prev => prev.map((e, i) => {
          return panelConfig[i]
              ? { ...e, ...panelConfig[i] }
              : e
        }))
      }
    },
    [open]
  )

  const addOption = () => {
    panelInfo.nextStepId = uuidv4()
    const updated = [...draft, panelInfo];
    setDraft(updated);
  }
  const removeOption = (id) => {
    const arrayFilter = draft.filter((e) => e.nextStepId !== id)
    let updated
    if(!arrayFilter.length){
      toast.error("You need at least one configuration panel")
      updated = draft
    } else {
      updated = [...draft.filter((e) => e.nextStepId !== id)];
    }
    setDraft(updated);
  }

  return (
    draft?.length
      ? draft?.map((_v, index) => {
        const setState = (patch) => setDraft(prev => prev.map((p, i) => i === index ? { ...p, ...patch } : p ))
        const updateConfigEntry = (bind: Partial<LoopConfigEntry>, value: any) => {
          console.log({bind, value})
          setDraft(prev =>
            prev.map((e, i) =>
              i === index ? { ...e, [bind]: value } : e
            )
          );
        };
        return (
          <RenderSchema
            schema={panelFormat} 
            draft={draft?.[index]}
            setDraft={setState}
            addOption={addOption}
            removeOption={removeOption}
            registerCommit={updateConfigEntry}
          />
        )
    })
    : <div className="text-sm text-muted-foreground">
        No configuration available.
      </div>
  )
}