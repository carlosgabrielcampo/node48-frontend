import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { ReactNode, useRef, useState } from "react";
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

export const LabeledInput = ({label, value, onChange, placeholder, className, children, ...props}: LabeledInputInterface) => {
    return(
        <div>
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

const objectFromArray = (array) => {
    return Object.fromEntries(array.map((e) => [e.key, e.value]))
}

export const KeyValueInput = ({bind, value, registerCommit}) => {
    const [inputValue, setValue] = useState(Object.entries(value ?? {}).map(([key, value]) => ({ id: uuid(), key, value })))
    const [newDraft, setNewDraft] = useState({key: "", value: ""})

    const keyRef = useRef<HTMLInputElement | null>(null);
    const valueRef = useRef<HTMLInputElement | null>(null);

    const commitDraft = () => {
        if (!newDraft.key || !newDraft.value) return;
        setValue(prev => {
            const updatedDraft = [...prev, { id: uuid(), key: newDraft.key, value: newDraft.value } ]
            registerCommit(bind, objectFromArray(updatedDraft))
            return updatedDraft
        });

        setNewDraft({ key: "", value: "" });
        requestAnimationFrame(() => { keyRef.current?.focus() });
    };

    const removeParams = (id: string) => {
        const updatedInput = inputValue.filter((e) => e.id !== id)
        registerCommit(bind, objectFromArray(updatedInput))
        setValue(updatedInput);
    }
    
    const updateParam = (index, patch: Partial<ObjectRow>) => {
        setValue(prev => {
            const updatedInput = prev.map((p, i) => i === index ? { ...p, ...patch } : p )
            registerCommit(bind, objectFromArray(updatedInput))
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