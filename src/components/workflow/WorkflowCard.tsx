import { formatDistanceToNow } from "date-fns";
import { Clock, FileText, Trash2, Copy, PenBox  } from "lucide-react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button'
import { WorkflowCardProps } from "@/types/workflows";

export const WorkflowCard = ({ workflow, onClick, setWorkflowDialog, setDialogOpen, setMode, deleteWorkflow }: WorkflowCardProps) => {
  const updateDate = workflow.updatedAtUTC || workflow.updatedAtUTC || new Date().toISOString();
  const formattedDate = formatDistanceToNow(new Date(updateDate), {
    addSuffix: true,
  });
  return (
    <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50  max-w-[350px]" onClick={onClick}>
      <CardContent>
        <div className="w-full" >
          <div className="relative flex items-start  w-full h-full min-h-28"  >
            <div className="w-full h-full " >
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
          
              <div className="absolute right-0 flex">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setWorkflowDialog(workflow); 
                    setDialogOpen(); 
                    setMode('update')
                  }}
                  variant="ghost"
                  size="sm"
                  aria-label="Update Workflow description"
                >
                  <PenBox className="h-4 w-4" />
                </Button>
                <Button
                  className=""
                  onClick={(e) => {
                    e.stopPropagation();
                    setWorkflowDialog(workflow); 
                    setDialogOpen(); 
                    setMode('create')
                  }}
                  variant="ghost"
                  size="sm"
                  aria-label="Duplicate workflow"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWorkflow(workflow.id)
                  }}
                  variant="ghost"
                  size="sm"
                  aria-label="Delete workflow"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground" onClick={onClick}>
            <Clock className="h-4 w-4" />
            <span>Updated {formattedDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
