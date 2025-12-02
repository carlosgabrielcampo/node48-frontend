import { Label } from "../ui/label"
import { Input } from "../ui/input"
export const SidebarInput = ({label, ...props}) => {
    return (
        <div>
            <Label className="text-xs">{label}</Label>
            <Input
                type={props.type}
                value={props.value}
                onChange={props.onChange}
                placeholder={props.placeholder}
                className={props.className}
            />
        </div>
    )
}