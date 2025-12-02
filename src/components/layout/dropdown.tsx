import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
interface ItemListInterface {
    value: string;
    displayName:  string;
}

interface DropdownInterface {
    value: string;
    label: string;
    onValueChange: (value: string) => void;
    itemList: ItemListInterface[];
}

export const SidebarDropdown = ({ value, label, onValueChange, itemList }: DropdownInterface) => {
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