import { Card, CardContent } from "../ui/card"
import { Label } from "../ui/label"
export const LabeledCard = ({label, headerChildren, cardChildren }) => {
    return (
        <Card >
            <CardContent >
                <div className="flex items-center justify-between min-h-9">
                    <Label className="font-semibold">{label}</Label>
                    {headerChildren}
                </div>
                {cardChildren}
            </CardContent>
        </Card>
    )
}

