import { formatDistanceToNow } from "date-fns";
import { Clock, FileText, Trash2, Copy, PenBox  } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button'
import { WorkflowCardProps } from "@/types/workflows";

export const WorkflowCard = ({ workflow, onClick, setWorkflowDialog, setDialogOpen, setMode }: WorkflowCardProps) => {
  const updateDate = workflow.updatedAtUTC || workflow.updatedAtUTC || new Date().toISOString();
  const formattedDate = formatDistanceToNow(new Date(updateDate), {
    addSuffix: true,
  });
  return (
    <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 w-full h-full max-w-[350px]" >
      <CardContent>
        <div className="w-full">
          <div className="flex items-start gap-3 w-full h-full min-h-28">
            <div className="w-full" onClick={onClick}>
              <div className="p-2 flex items-center justify-center rounded-lg bg-primary/10 w-10 ">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="p-2">
                <CardTitle className="text-lg truncate">{workflow.name}</CardTitle>
                {workflow.description && (
                  <CardDescription className="line-clamp-2 mt-1.5">
                    {workflow.description}
                  </CardDescription>
                )}
              </div>
            </div>
          
            <div className="relative w-full h-full">
              <div className="absolute right-0 flex">
                <Button
                  onClick={() => {setWorkflowDialog(); setDialogOpen(); setMode('update')}}
                  variant="ghost"
                  size="sm"
                  aria-label="Update Workflow description"
                >
                  <PenBox className="h-4 w-4" />
                </Button>
                <Button
                  className=""
                  onClick={() => console.log({copy: workflow})}
                  variant="ghost"
                  size="sm"
                  aria-label="Duplicate workflow"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => console.log({delete: workflow})}
                  variant="ghost"
                  size="sm"
                  aria-label="Delete workflow"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground z-50" onClick={onClick}>
            <Clock className="h-4 w-4" />
            <span>Updated {formattedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
