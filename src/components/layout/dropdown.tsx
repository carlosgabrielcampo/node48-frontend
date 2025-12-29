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
    children: React.ReactElement
    onSelect: ({value}: {value: string}) => void;
    options: ListStructure[];
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

const MenuItems = ({options, onSelect}) => {
    return (
        options?.length && options
            .map(({itemProperties, display}) => (
                <Item key={display} itemProperties={itemProperties} onSelect={onSelect} itemDisplay={display}  />
            ))
    )
}

const MenuContent = ({menuLabel, options, onSelect}) => {
    return (
        <>
            {
                menuLabel && (
                    <DropdownMenuLabel className="flex w-full items-center gap-2">
                        { menuLabel }
                    </DropdownMenuLabel>
                )
            } 
            { options?.length && <MenuItems options={options} onSelect={onSelect}/> }
        </>
    )
}

const ExtraContent = ({ dropdownExtra }) => {
    return (
        dropdownExtra?.length && dropdownExtra.map(({label, options, onSelect}) =>
            <>
                <DropdownMenuSeparator />
                <MenuContent menuLabel={label} options={options} onSelect={onSelect} />
            </>
        )
    )
}

export const LabeledDropdown = ({...props}: DropdownInterface) => 
<div className={"h-full w-full flex flex-col gap-2"} key={props.label}>
    {props.label && <Label className="text-xs">{props.label}</Label>}
    <DropdownMenu>
        <DropdownMenuTrigger asChild >
            <Button variant="outline" size="sm" className="justify-between gap-2 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                <div className="flex w-full justify-between">
                    <p className="overflow-hidden">{ String(props.header).toUpperCase() }</p>
                    <ChevronDown className="ml-2 h-4 w-4"/>
                </div>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[var(--radix-popper-anchor-width)]">
            <MenuContent menuLabel={props.menuLabel} options={props.options} onSelect={props.onSelect} />
            <ExtraContent dropdownExtra={props.dropdownExtra} />
        </DropdownMenuContent>
    </DropdownMenu>
</div>

LabeledDropdown.displayName = "LabeledDropdown"