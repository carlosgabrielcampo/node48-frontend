import { KeyValueInput, LabeledArrayInput, LabeledInput } from "@/components/layout/input";
import { CodeTextarea, LabeledTextArea } from "@/components/layout/textArea";
import { LabeledDropdown } from "../layout/dropdown";
import { LabeledCard } from "@/components/layout/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { LabeledCheckbox } from "@/components/layout/checkbox";
import React from "react";

type SchemaProps = {
  type: string;
  bind: string;
  label: string;
  header: string;
  format: string;
  switch: any;
  options: any;
  children: any[];
  component: React.ReactElement;
  menuLabel: string;
  placeholder: string;
  dropdownExtra: any;
}
type RendererProps = {
  open: boolean;
  position?: any[];
  draft: Record<string, any>;
  schema?: SchemaProps;
  defaultPanel: Record<string, any>;
  setDraft?: (v: Record<string, any>) => void;
  removeState: (position: any[] ) => void;
  commit?: (bind: string, v: Record<string, any>) => void;
  connections?: any;
};
type ChildrenProps = {
  open: boolean;
  position?: any[];
  draft: Record<string, any>;
  schema?: SchemaProps[];
  defaultPanel: Record<string, any>;
  setDraft?: (v: Record<string, any>) => void;
  removeState: (position: any[] ) => void;
  commit?: (bind: string, v: Record<string, any>) => void;
  connections?: any;
};

export function RenderSchema({ schema, draft, setDraft, position, commit, connections, ...props  }: RendererProps) {
  if (!schema) return null;
  const renderProps = { schema, draft, setDraft, position, open, ...props }
  const {bind, children, format } = schema
  const draftValue = draft[bind] ?? ""

  switch(format){
    case "array": {
      return draftValue?.length 
        ? draftValue?.map((draftI, index) => {
          const updateDraft = (patch) => {
            draft[bind] = draftValue.map((p, i) => i === index ? { ...p, ...patch } : p); 
            setDraft(draft)
          }
          draft.render_id = uuidv4()
          return ChildrenRender({...props, draft: draftI, commit, schema: children, setDraft: updateDraft, position: [...position, bind, index]})
        })
        : <></>
    }
    case "object": {
      const updateDraft = (patch) => {
        draft[bind] = { ...draft[bind], ...patch }
        setDraft(draft)
      }
      return draft[bind] ? ChildrenRender({ ...renderProps, schema: children, draft: draft[bind], setDraft: updateDraft, position: [...position, bind]}) : <></>
    }
    default: return ComponentRender({schema, draft, setDraft, position, commit, connections, ...props})
  }
}

export const ChildrenRender = ({schema, ...props}: ChildrenProps) => schema?.length ? schema.map((child: any, i: number) => RenderSchema({schema: child, ...props})) : <></>

const ComponentRender = ({schema, draft, setDraft, commit, position, defaultPanel, open, removeState, connections }) => {
  const { bind, label, placeholder, component, options, menuLabel, dropdownExtra, switch: switcher, type, children, header } = schema
  const renderProps = { schema, draft, setDraft, commit, position, defaultPanel, open, removeState, connections }
  const childRender = ChildrenRender({...renderProps, schema: children })
  const headRender = ChildrenRender({...renderProps, schema: header })
  const draftValue = draft[bind] ?? ""

  switch (component) {
    case "AddButton": return <Button size="sm" variant="outline" onClick={() => AddOnClick({type, defaultPanel, draft, connections, setDraft, bind})}><Plus className="h-4 w-4" />{label}</Button>
    case "LabeledCard": return <LabeledCard label={label} header={headRender}>{childRender}</LabeledCard>
    case "KeyValueList": return <KeyValueInput bind={bind} value={draftValue} commit={commit} />
    case "CodeTextarea": return <CodeTextarea state={draft} bind={bind} setDraft={setDraft} value={draftValue} className={""}/>
    case "DeleteButton": return <Button size="sm" variant="ghost" onClick={() => removeState(position)}><Trash2 className="h-4 w-4" /></Button>
    case "LabeledInput": return <LabeledInput label={label} placeholder={placeholder} value={draftValue} onChange={({target: {value}}) => setDraft({ ...draft, [bind]: value })} commit={commit}>{childRender}</LabeledInput>
    case "LabeledCheckbox": return <LabeledCheckbox id={bind} checked={draftValue} onCheckedChange={(checked) => setDraft({ ...draft, [bind]: checked })} label={"Strict Mode"} />
    case "LabeledTextArea": return <LabeledTextArea label={label} state={draft} value={draftValue} bind={bind} setDraft={setDraft} className={""}/>
    case "LabeledDropdown": return <LabeledDropdown label={label} options={options} menuLabel={menuLabel} header={draftValue} dropdownExtra={dropdownExtra} onSelect={({value}) => setDraft({ ...draft, [bind]: value })}>{childRender}</LabeledDropdown>
    case "LabeledArrayInput": return <LabeledArrayInput label={label} arrayValue={draftValue} onChange={(value) => setDraft({ ...draft, [bind]: value })}>{childRender}</LabeledArrayInput> 
    case "SwitchableChildren": return RenderSchema({ ...renderProps, schema: switcher.find((e) => e.key === draftValue)})
    default: return <></>;
  }
}

const AddOnClick = ({type, defaultPanel, draft, connections, setDraft, bind}) => {
  const draftValue = draft[bind] ?? ""
  switch(type){
    case "new_default": {
      const cloned = structuredClone(defaultPanel);
      const id = uuidv4()
      cloned.nextStepId = id
      connections[id] = ""
      return draft ? setDraft([...draft, cloned]) : setDraft([cloned])
    }
    case "new_array": return setDraft(draft[bind].push(structuredClone(draftValue.at(-1))))
    default: return
  }
}