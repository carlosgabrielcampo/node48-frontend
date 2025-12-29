import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
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

const objectFromArray = (array) => { return Object.fromEntries(array.map((e) => [e.key, e.value])) }

export const KeyValueInput = ({bind, value, commit, open}) => {
    const [inputValue, setValue] = useState([])
    const [newDraft, setNewDraft] = useState({key: "", value: ""})
    
    const keyvalues = value ? [...Object.entries(value ?? {}).map(([key, value]) => ({ id: uuid(), key, value }))]: []
    useEffect(() => setValue(keyvalues), [keyvalues.length])

    const keyRef = useRef<HTMLInputElement | null>(null);
    const valueRef = useRef<HTMLInputElement | null>(null);

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
        <div className="flex gap-2">
            <Input
                ref={keyRef}
                key={"value"}
                value={newDraft.key}
                onChange={e => setNewDraft({ ...newDraft, key: e.target.value })}
                onKeyDown={e => {
                    if(e.key === "Enter"){
                        if(!newDraft.value) valueRef.current?.focus()
                        if(newDraft.value) commitDraft()
                    }
                }}
                placeholder="Key"
                className="flex-1"

            />
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
                className="flex-1"
            />
            <div className="w-10"/>
        </div>
    
    return inputValue?.length 
        ? 
        <>
            {
                inputValue?.map(({key, value, id}, i) => (
                    <div className="flex gap-2">
                        <Input
                            key={`key${id}`}
                            value={key || ""}
                            onChange={e => updateParam(i, { key: e.target.value })}
                            placeholder="Key"
                            className="flex-1"
                        />
                        <Input
                            key={`value${id}`}
                            value={value || ""}
                            onChange={e => updateParam(i, { value: e.target.value })}
                            placeholder="Value"
                            className="flex-1"
                        />
                        <Button onClick={() => removeParams(id) } size="sm" variant="outline">
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </div>
                ))
            }
         { newInputGroup }
        </>
        :  newInputGroup
}