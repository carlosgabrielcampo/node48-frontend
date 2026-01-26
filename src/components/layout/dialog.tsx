import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog"
import { cn } from "@/lib/utils"
interface ClassInterface {
    contentClass: string;
}

interface DialogLayoutInterface {
    dialogTitle?: React.ReactNode;
    dialogDescription?: React.ReactNode;
    dialogFooter?: React.ReactNode;
    children?: React.ReactNode;
    open: boolean;
    handleClose: (e: boolean) => void;
    classes: ClassInterface;
}

export const DialogLayout = ({dialogTitle, dialogDescription, dialogFooter, children, open, handleClose, classes}: DialogLayoutInterface) => {
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className={cn("flex flex-col", classes?.contentClass)}>
                <DialogHeader>
                    <DialogTitle>{dialogTitle}</DialogTitle>
                    <DialogDescription>{dialogDescription}</DialogDescription>
                </DialogHeader>
                {children}
                <DialogFooter>{dialogFooter}</DialogFooter>
            </DialogContent>
        </Dialog>        
    )
}