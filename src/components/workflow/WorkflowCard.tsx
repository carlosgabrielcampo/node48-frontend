import { formatDistanceToNow } from "date-fns";
import { Clock, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Workflow } from "@/services/workflowService";

interface WorkflowCardProps {
  workflow: Workflow;
  onClick: () => void;
}

export const WorkflowCard = ({ workflow, onClick }: WorkflowCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(workflow.createdAtUTC), {
    addSuffix: true,
  });

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{workflow.name}</CardTitle>
            {workflow.description && (
              <CardDescription className="line-clamp-2 mt-1.5">
                {workflow.description}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Created {formattedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
};
