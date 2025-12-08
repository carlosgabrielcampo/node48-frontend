import { Label } from "../ui/label"
import { Input } from "../ui/input"
interface LabeledInputInterface {
    label: string; 
    value: any;
    onChange: (value) => void
    placeholder: string;
    className: string;
    props?: any;
}

export const LabeledInput = ({label, value, onChange, placeholder, className, props}: LabeledInputInterface) => {
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
        </div>
    )
}