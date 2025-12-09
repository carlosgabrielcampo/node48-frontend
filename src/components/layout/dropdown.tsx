import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
interface ListStructure {
    displayName: string;
    value: string;
}
interface DropdownInterface {
    value: string;
    label?: string;
    onValueChange: (value: string) => void;
    itemList: ListStructure[];
    className?: string;
}

export const LabeledDropdown = ({ value, label, onValueChange, itemList, className }: DropdownInterface) => {
    return (
        <div >
            <Label>{label}</Label>
            <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className={cn("mt-1", className)} >
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                { itemList?.length && itemList.map(({value, displayName}) => <SelectItem key={value} value={value}>{displayName}</SelectItem>) }
            </SelectContent>
            </Select>
        </div>
    )
}