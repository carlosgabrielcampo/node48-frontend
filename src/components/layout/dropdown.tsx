import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import React from "react";
import { Label } from "../ui/label";
interface ListStructure {
    itemProperties: React;
    itemDisplay: string;
}

interface DropdownInterface {
    value: string;
    label?: string;
    onSelect: (value: string) => void;
    itemsList: ListStructure[];
    menuLabel?: string;
    header: React;
    dropdownExtra: ListStructure[];
}

const Item = ({itemProperties, onSelect, itemDisplay}) => {
    return (
        <DropdownMenuItem onSelect={() => onSelect(itemProperties.value)}>
            {String(itemDisplay).toUpperCase()}
        </DropdownMenuItem>
    )
}

const MenuItems = ({itemsList, onSelect}) => {
    return (
        itemsList?.length && itemsList
            .map(({itemProperties, itemDisplay}) => (
                <Item itemProperties={itemProperties} onSelect={onSelect} itemDisplay={itemDisplay} />
            ))
    )
}

const MenuContent = ({menuLabel, itemsList, onSelect}) => {
    return (
        <>
            { menuLabel && (
                <DropdownMenuLabel className="flex w-full items-center gap-2">
                    { menuLabel }
                </DropdownMenuLabel>
            )
            } 
            { 
                itemsList?.length && <MenuItems itemsList={itemsList} onSelect={onSelect}/>
            }
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
            <DropdownMenuTrigger asChild className="flex min-w-[8rem] rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                <Button variant="outline" size="sm" className=" justify-between gap-2 ">
                    { String(header).toUpperCase() }
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className={"flex w-full flex-col"}>
                <MenuContent menuLabel={menuLabel} itemsList={itemsList} onSelect={onSelect} />
                <ExtraContent dropdownExtra={dropdownExtra} />
            </DropdownMenuContent>
        </DropdownMenu>
        </div>
    )
}

LabeledDropdown.displayName = "LabeledDropdown"