import { Card, CardContent } from "../ui/card"
import { Label } from "../ui/label"

export const LabeledCard = ({children, label, header, ...props}) => 
    <Card key={label}>
        <CardContent >
            <div className="flex items-center justify-between min-h-9">
                <Label className="font-semibold w-full">{label}</Label>
                {header}
            </div>
            {children}
        </CardContent>
    </Card>