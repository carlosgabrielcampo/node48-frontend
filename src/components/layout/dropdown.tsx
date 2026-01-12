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
    display: string;
}

interface DropdownInterface {
    label?: string;
    children?: React.ReactElement;
    onSelect: ({value}: {value: string}) => void;
    options: ListStructure[];
    menuLabel?: string;
    header: React.ReactElement | string;
    dropdownExtra?: ListStructure[];
}

const Item = ({itemProperties, onSelect, display}: {itemProperties: ItemProperties; onSelect: (props: ItemProperties) => void; display: string}) => {
    return (
        <DropdownMenuItem onSelect={() => onSelect(itemProperties)} className={"w-30"}>
            { display }
        </DropdownMenuItem>
    )
}

const MenuItems = ({options, onSelect}: {options: ListStructure[]; onSelect: (props: ItemProperties) => void}) => {
    return (
        <>
            {options?.length && options.map(({itemProperties, display}) => {
                {console.log({itemProperties, display, options})}
                
                return (<Item key={display} itemProperties={itemProperties} onSelect={onSelect} display={display} />)

            })}
        </>
    )
}

const MenuContent = ({menuLabel, options, onSelect}: {menuLabel?: string; options: ListStructure[]; onSelect: (props: ItemProperties) => void}) => {
    return (
        <>

            {menuLabel && (
                <DropdownMenuLabel className="flex w-full items-center gap-2 border">
                    { menuLabel }
                </DropdownMenuLabel>
            )} 
            { options?.length > 0 && <MenuItems options={options} onSelect={onSelect}/> }
        </>
    )
}

const ExtraContent = ({ dropdownExtra }: { dropdownExtra?: any[] }) => {
    if (!dropdownExtra?.length) return null;
    return (
        <>
            {dropdownExtra.map(({label, options, onSelect}, index) => (
                <React.Fragment key={index}>
                    <DropdownMenuSeparator />
                    <MenuContent menuLabel={label} options={options} onSelect={onSelect} />
                </React.Fragment>
            ))}
        </>
    )
}

export const LabeledDropdown = ({...props}: DropdownInterface) => (
    <div className={"h-full w-full flex flex-col gap-2"} key={props.label}>
        {props.label && <Label className="text-xs">{props.label}</Label>}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="justify-between gap-2 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                    <div className="flex w-full justify-between items-center">
                        <span className="overflow-hidden">
                            {typeof props.header === 'string' ? props.header.toUpperCase() : props.header}
                        </span>
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
);

LabeledDropdown.displayName = "LabeledDropdown";
