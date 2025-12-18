import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import React from "react";
import { Label } from "../ui/label";
interface ItemProperties {
    value: any;
}

interface ListStructure {
    itemProperties: ItemProperties;
    itemDisplay: string;
}

interface DropdownInterface {
    label?: string;
    onSelect: ({value}: {value: string}) => void;
    itemsList: ListStructure[];
    menuLabel?: string;
    header: React.ReactElement;
    dropdownExtra?: ListStructure[];
}

const Item = ({itemProperties, onSelect, itemDisplay}) => {
    return (
        <DropdownMenuItem onSelect={() => onSelect(itemProperties)} className={"w-30"}>
            {String(itemDisplay).toUpperCase()}
        </DropdownMenuItem>
    )
}

const MenuItems = ({itemsList, onSelect}) => {
    return (
        itemsList?.length && itemsList
            .map(({itemProperties, itemDisplay}) => (
                <Item key={itemDisplay} itemProperties={itemProperties} onSelect={onSelect} itemDisplay={itemDisplay}  />
            ))
    )
}

const MenuContent = ({menuLabel, itemsList, onSelect}) => {
    return (
        <>
            {
                menuLabel && (
                    <DropdownMenuLabel className="flex w-full items-center gap-2">
                        { menuLabel }
                    </DropdownMenuLabel>
                )
            } 
            { itemsList?.length && <MenuItems itemsList={itemsList} onSelect={onSelect}/> }
        </>
    
    )
}

const ExtraContent = ({ dropdownExtra }) => {
    return (
        dropdownExtra?.length && dropdownExtra.map(({label, itemsList, onSelect}) =>
            <>
                <DropdownMenuSeparator />
                <MenuContent menuLabel={label} itemsList={itemsList} onSelect={onSelect} />
            </>
        )
    )
}

export const LabeledDropdown = ({ onSelect, itemsList, header, menuLabel, dropdownExtra, className, label }: DropdownInterface) => {
    return (
        < div className={"h-full w-full"}>
        {label && <Label className="text-xs">{label}</Label>}
        <DropdownMenu>
            <DropdownMenuTrigger asChild >
                <Button variant="outline" size="sm" className="justify-between gap-2 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                    <div className="flex w-full justify-between">
                        <p className="overflow-hidden">{ String(header).toUpperCase() }</p>
                        <ChevronDown className="ml-2 h-4 w-4"/>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[var(--radix-popper-anchor-width)]">
                <MenuContent menuLabel={menuLabel} itemsList={itemsList} onSelect={onSelect} />
                <ExtraContent dropdownExtra={dropdownExtra} />
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
    )
}

LabeledDropdown.displayName = "LabeledDropdown"