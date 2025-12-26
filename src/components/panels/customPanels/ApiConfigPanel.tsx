import { KeyValueInput, LabeledInput } from "@/components/layout/input";
import { CodeTextarea } from "@/components/layout/textArea";
import { LabeledDropdown } from "../../layout/dropdown";
import { LabeledCard } from "@/components/layout/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { UUID } from "crypto";

type RendererProps = {
  open: boolean;
  position?: any[];
  draft: Record<string, any>;
  schema?: Record<string, any>;
  defaultPanel: Record<string, any>;
  setDraft?: (v: Record<string, any>) => void;
  removeState: (id: UUID, position: any[] ) => void;
  commit?: (bind: string, v: Record<string, any>) => void;
};

export const ChildrenRender = ({draft, setDraft, schema, commit, position, defaultPanel, open, removeState}: RendererProps) =>
  schema?.length 
    ? schema.map((child: any, i: number) => RenderSchema({open, draft, schema: child, commit, position, defaultPanel, setDraft, removeState}))
    : <></>


export function RenderSchema({ schema, draft, setDraft, commit, position, defaultPanel, open, removeState }: RendererProps) {
  if (!schema) return null;
  const {header, bind, label, placeholder, component, children, options, menuLabel, dropdownExtra, switch: switcher, format, type } = schema
  const draftValue = draft[bind] ?? ""
  const childRender = ChildrenRender({open, draft, setDraft, schema: children, commit, position, defaultPanel, removeState})
  const headRender = ChildrenRender({open, draft, setDraft, schema: header, commit, position, defaultPanel, removeState})

  switch(format){
    case "array": 
      return draftValue?.length 
        ? draftValue?.map((draft, index) => {
            const updateDraft = (patch) => {
              draft[bind] = draftValue.map((p, i) => i === index ? { ...p, ...patch } : p); 
              setDraft(draft)
            }
            draft.render_id = uuidv4()
            return draft && ChildrenRender({open, draft, commit, schema: children, removeState, setDraft: updateDraft, position: [...position, bind, index], defaultPanel})
        })
        : <></>
    }

  switch (component) {
    case "LabeledCard": return <LabeledCard label={label} header={headRender}>{childRender}</LabeledCard>
    case "KeyValueList": return <KeyValueInput bind={bind} value={draftValue} commit={commit} open={open} />
    case "CodeTextarea": return <CodeTextarea state={draft} bind={bind} setDraft={setDraft} value={draftValue} commit={commit}>{childRender}</CodeTextarea>
    case "DeleteButton": return <Button size="sm" variant="ghost" onClick={() => removeState(draft.render_id, position)}><Trash2 className="h-4 w-4" /></Button>
    case "SwitchableChildren": return RenderSchema({open, draft, commit, setDraft, position, schema: switcher.find((e) => e.key === draftValue), removeState, defaultPanel})
    case "LabeledInput": {
      const onChange = ({target: {value}}) => setDraft({ ...draft, [bind]: value })
      return <LabeledInput label={label} placeholder={placeholder} value={draftValue} onChange={onChange} commit={commit}>{childRender}</LabeledInput>
    }
    case "LabeledDropdown": {
      const onSelect = ({value}) => setDraft({ ...draft, [bind]: value })
      return <LabeledDropdown label={label} options={options} menuLabel={menuLabel} header={draftValue} dropdownExtra={dropdownExtra} onSelect={onSelect}>{childRender}</LabeledDropdown>
    }
    case "AddOptions": {
      let addOption = () => {}
      if(type === "new_default") {
        const cloned = structuredClone(defaultPanel);
        cloned.nextStepId = uuidv4()
        addOption = () => setDraft([...draft, cloned])
      }
      if(type === "new_array"){ 
        const cloned = structuredClone(draftValue.at(-1));
        addOption = () => setDraft(draft[bind].push(cloned)) 
      }
      return <Button size="sm" variant="outline" onClick={addOption}><Plus className="h-4 w-4" />{label}</Button>
    }

    default: return <></>;
  }
}

