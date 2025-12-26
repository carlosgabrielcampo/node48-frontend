import { Card, CardContent } from "../ui/card"
import { Label } from "../ui/label"

export const LabeledCard = ({children, label, header}) => 
    <Card key={label}>
        <CardContent>
            {
                header
                    ? <div className="flex items-center justify-between min-h-9">
                        <Label className="font-semibold w-full">{label}</Label>
                        {header}
                    </div>
                    : <></>
            }
            {children}
        </CardContent>
    </Card>