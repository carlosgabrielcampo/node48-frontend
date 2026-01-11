import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { v4 as uuid } from "uuid";

interface LabeledInputInterface {
    label: string; 
    value: any;
    onChange?: (value: any) => void
    placeholder?: string;
    className?: string;
    children?: ReactNode;
    type?: string;
    [key: string]: any;
}

interface LabeledArrayInputInterface {
    label: string; 
    arrayValue: any;
    onChange?: (value: any) => void
    placeholder?: string;
    className?: string;
    children?: ReactNode;
    type?: string;
    [key: string]: any;
}

export const LabeledInput = ({label, value, onChange, placeholder, className, children, ...props}: LabeledInputInterface) => {
    return(
        <div key={label} className="flex flex-col gap-2">
            <Label className="text-xs">{label}</Label>
            <Input
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={className}
                {...props}
            />
            {children}
        </div>
    )
}

export const LabeledArrayInput = ({label, arrayValue, onChange, placeholder, className, children, ...props}: LabeledArrayInputInterface) => {
    return(
        <div key={label} className="gap-2 flex flex-col">
            <Label className="text-xs h-full">{label}</Label>
            {
                arrayValue?.length ? arrayValue.map((item, index) => {
                    const itemChange = (value, index) => {
                        arrayValue[index] = value
                        onChange(arrayValue)
                    }
                    const itemDelete = (value, index) => {
                        value.splice(index, 1)
                        onChange(value)
                    }
                    return (
                    <div className="flex w-full gap-2">
                        <Input
                            value={`${item}`}
                            onChange={({target: {value}}) => itemChange(value, index)}
                            placeholder={placeholder}
                            className={"flex-1"}
                            {...props}
                        />
                        <Button onClick={() => itemDelete(arrayValue, index)} size="sm" variant="outline"><Trash2 className="h-4 w-4"/></Button>
                    </div>
                    )
                })
                : <></>
            }
            {children}
        </div>
    )
}

const objectFromArray = (array) => { return array?.length ? Object.fromEntries(array.map((e) => [e.key, e.value])) : {} }

export const KeyValueInput = ({bind, value, commit, type }) => {
    const [inputValue, setValue] = useState([])
    const [newDraft, setNewDraft] = useState({key: "", value: ""})
    const [unmaskedKeys, setUnmaskedKeys] = useState<Set<string>>(value ? new Set(Object.keys(value)) : []);
    const keyvalues = value ? [...Object.entries(value ?? {}).map(([key, value]) => ({ id: uuid(), key, value }))]: []
    useEffect(() => setValue(keyvalues), [keyvalues.length])
    const keyRef = useRef<HTMLInputElement | null>(null);
    const valueRef = useRef<HTMLInputElement | null>(null);
    const toggleMask = (key: string) => {
        setUnmaskedKeys((prev) => {
        const next = new Set(prev);
        if (next.has(key)) {
            next.delete(key);
        } else {
            next.add(key);
        }
        return next;
        });
    };
    const commitDraft = () => {
        if (!newDraft.key || !newDraft.value) return;
        setValue(prev => {
            const updatedDraft = [...prev, { id: uuid(), key: newDraft.key, value: newDraft.value } ]
            commit(bind, objectFromArray(updatedDraft))
            return updatedDraft
        });

        setNewDraft({ key: "", value: "" });
        requestAnimationFrame(() => { keyRef.current?.focus() });
    };
    const removeParams = (id: string) => {
        const updatedInput = inputValue.filter((e) => e.id !== id)
        commit(bind, objectFromArray(updatedInput))
        setValue(updatedInput);
    }
    const updateParam = (index, patch: Partial<ObjectRow>) => {
        setValue(prev => {
            const updatedInput = prev.map((p, i) => i === index ? { ...p, ...patch } : p )
            commit(bind, objectFromArray(updatedInput))
            return updatedInput
        })
    }

    const newInputGroup =
        <div className="flex gap-2 p-1 w-full">
            <Input
                ref={keyRef}
                key={"value"}
                value={newDraft.key}
                onChange={e => setNewDraft({ ...newDraft, key: e.target.value })}
                onKeyDown={e => {
                    if(e?.key === "Enter"){
                        if(!newDraft.value) valueRef?.current?.focus()
                        if(newDraft?.value) commitDraft()
                    }
                }}
                placeholder="Key"
                className="w-full"
            />
            <div className="relative flex w-full">
            <Input
                ref={valueRef}
                key={"key"}
                value={newDraft.value}
                onChange={e => setNewDraft({ ...newDraft, value: e.target.value })}
                onKeyDown={e => {
                    if(e.key === "Enter" && newDraft.key) commitDraft()
                    else if(e.key === "Enter" && !newDraft.key) keyRef.current.focus()
                }}
                onBlur={commitDraft}
                placeholder="Value"
                className="w-full"
            />
            </div>
            
            <Button
              type="button"
              variant="outline"
              className="h-10 w-10"
              onClick={commitDraft}
            >
              <Plus  />
            </Button>
        </div>
    
    const inputType = ({value, key, onChange, type}) => {
        switch (type) {
            case "masked": {
                return <div className="relative flex w-full">
                    <Input
                      type={unmaskedKeys?.has(key) ? "text" : "password" }
                      value={value}
                      onChange={onChange}
                      placeholder="value"
                      className="font-mono text-sm w-full"
                      readOnly={unmaskedKeys?.has(key) ? false : true}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                      onClick={() => toggleMask(key)}
                      aria-label={unmaskedKeys?.has(key) ? "Hide value" : "Show value" }
                    >
                      {
                        unmaskedKeys?.has(key) 
                            ? ( <Eye className="h-4 w-4" /> ) 
                            : ( <EyeOff className="h-4 w-4" /> )
                      }
                    </Button>
                  </div>
            }
            default: return <Input key={key} value={value || ""} onChange={onChange} placeholder="Value" className="flex w-full" />
        }

    }
    
    return inputValue?.length 
        ? 
        <>
            {
                inputValue?.map(({key, value, id}, i) => (
                    <div className="flex gap-2 p-1 w-full">
                        <Input key={`key${id}`} value={key || ""} onChange={e => updateParam(i, { key: e.target.value })} placeholder="Key" className="w-full" />
                        { inputType({ value, key: `value${id}`, onChange:((e) => updateParam(i, { value: e.target.value } )), type })}
                        <Button onClick={() => removeParams(id) } className="h-10 w-10" variant="outline"><Trash2 className="h-4 w-4 text-destructive"/></Button>

                    </div>
                ))
            }
         { newInputGroup }
        </>
        :  newInputGroup
}