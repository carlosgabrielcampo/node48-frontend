import { Card } from "../ui/card"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
export const LabeledCard = ({label, headerChildren, cardChildren}) => {
    return (
        <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
                <Label className="font-semibold">{label}</Label>
                {headerChildren}
            </div>
            {cardChildren}
        </Card>
    )
}