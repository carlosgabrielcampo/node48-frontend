import { KeyValueInput, LabeledInput } from "@/components/layout/input";
import { CodeTextarea } from "@/components/layout/textArea";
import { LabeledDropdown } from "../../layout/dropdown";
import { LabeledCard } from "@/components/layout/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

type RendererProps = {
  draft: Record<string, any>;
  schema?: Record<string, any>;
  setDraft?: (v: Record<string, any>) => void;
  commit?: (bind: string, v: Record<string, any>) => void;
  position: any[];
};

export const ChildrenRender = ({draft, setDraft, schema, commit, position}: RendererProps) =>
  schema?.length && schema.map((child: any, i: number) =>
    <RenderSchema 
      schema={child} 
      draft={draft} 
      setDraft={setDraft} 
      commit={commit}
      position={position}
    />
)

export function RenderSchema({ schema, draft, setDraft, commit, position }: RendererProps) {
  console.log(position)
  if (!schema) return null;
  const {header, bind, label, placeholder, component, children, options, menuLabel, dropdownExtra, switch: switcher, format, type } = schema
  const draftValue = draft[bind] ?? ""

  if(format === "array"){
    return draftValue.map((child, index) => {
      const updateDraft = (patch) => {
        draft[bind] = draftValue.map((p, i) => i === index ? { ...p, ...patch } : p )
        setDraft(draft)
      }
      child.render_id = uuidv4()
      return <ChildrenRender draft={child} setDraft={updateDraft} schema={children} commit={commit} position={[...position, [bind, index]]} />
    })
  }

  const childrenRender = children ? <ChildrenRender draft={draft} setDraft={setDraft} schema={children} commit={commit} position={position} /> : <></>
  const headRender = header ? <ChildrenRender draft={draft} setDraft={setDraft} schema={header} commit={commit} position={position} /> : <></>
  
  switch (component) {
    case "LabeledInput": {
      const onChange = ({target: {value}}) => setDraft({ ...draft, [bind]: value })
      return <LabeledInput label={label} placeholder={placeholder} value={draftValue} onChange={onChange} commit={commit}>
        {childrenRender}
      </LabeledInput>
    }

    case "LabeledDropdown": {
      const onSelect = ({value}) => setDraft({ ...draft, [bind]: value })
      return <LabeledDropdown label={label} options={options} menuLabel={menuLabel} header={draftValue} dropdownExtra={dropdownExtra} onSelect={onSelect}>
          {childrenRender}
      </LabeledDropdown>
    }

    case "LabeledCard": {
      return <LabeledCard label={label} header={headRender}>{childrenRender}</LabeledCard>
    }

    case "CodeTextarea": {
      return <CodeTextarea state={draft} bind={bind} setDraft={setDraft} value={draftValue} commit={commit}>{childrenRender}</CodeTextarea>
    }

    case "KeyValueList":
      return <KeyValueInput bind={bind} value={draftValue} commit={commit} />

    case "AddOptions": {
      let addOption = () => {}
      if(type === "new_default") addOption = () => {
        console.log({[type]: draft, bind})
      }
      if(type === "new_array") addOption = () => {
        const lastElement = draft[bind].at(-1)
        setDraft(draft[bind].push(lastElement))
      }
      return <Button size="sm" variant="outline" onClick={addOption}><Plus className="h-4 w-4" />{label}</Button>
    }

    case "DeleteButton": {
      const removeOption = () => draft[bind].filter((e) => console.log(e))
      return <Button size="sm" variant="ghost" onClick={removeOption}><Trash2 className="h-4 w-4" /></Button>
    }

    case "SwitchableChildren": {
      const schemaSelected = switcher.find((e) => e.key === draftValue)
      return <RenderSchema draft={draft} setDraft={setDraft} schema={schemaSelected} commit={commit} position={position}/>
    }

    default:
      return <></>;
  }
}

