import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { ReactNode } from "react";

interface LabeledInputInterface {
    label: string; 
    value: any;
    onChange: (value) => void
    placeholder: string;
    className: string;
    children?: ReactNode;
    props?: any;
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