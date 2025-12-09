import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const Dropdown = ({ value, label, onValueChange, itemList, className }) => {
    return (
        <div >
            <Label>{label}</Label>
            <Select value={value} onValueChange={onValueChange}>
            <SelectTrigger className={`mt-1 ${className} `} >
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                { itemList?.length && itemList.map(({value, displayName}) => <SelectItem key={value} value={value}>{displayName}</SelectItem>) }
            </SelectContent>
            </Select>
        </div>
    )
}