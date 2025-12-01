import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const Dropdown = ({ value, label, onValueChange, itemList }) => {
    return (
        <div>
            <Label>{label}</Label>
            <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className="mt-1">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                { itemList.map(({value, displayName}) => <SelectItem value={value}>{displayName}</SelectItem>) }
            </SelectContent>
            </Select>
        </div>
    )
}