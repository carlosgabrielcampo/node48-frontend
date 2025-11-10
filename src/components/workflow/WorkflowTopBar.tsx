import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface WorkflowTopBarProps {
  workflowId?: string;
  workflowName?: string;
}

export const WorkflowTopBar = ({
  workflowName = "Untitled Workflow",
}: WorkflowTopBarProps) => {
  const navigate = useNavigate()
  return (
    <header className="h-14 border-b bg-background flex items-center justify-between p-6 z-40 bg-primary/10">
        <div className="flex flex-row justify-between w-[100%] ">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/workflows")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{workflowName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Created: {format(new Date(), "PPP")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Updated: {format(new Date(), "PPP")}</span>
            </div>
          </div>
        </div>
    </header>
  );
};
