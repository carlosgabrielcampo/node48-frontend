import { Checkbox } from "../ui/checkbox"
import { Label } from "../ui/label"


export const LabeledCheckbox = ({ checked, onCheckedChange, id, label }) => {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
            />
            <Label htmlFor={id} className="text-xs cursor-pointer">
                {label}
            </Label>
        </div>
    )
}