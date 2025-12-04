import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { WorkflowTopBarProps } from "@/types/workflows";


export const WorkflowTopBar = ({ workflowName = "Untitled Workflow" }: WorkflowTopBarProps) => {
  const navigate = useNavigate()
  return (
    <header className="flex items-center gap-2 p-4 border-b bg-background">
        <div className="flex flex-row justify-between w-[100%] ">
          <div className="flex justify-between items-center">
            <Button
              className="p-1 mr-1"
              variant="ghost"
              size="icon"
              onClick={() => navigate("/workflows")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="min-w-10 h-8 text-2xl font-bold overflow-hidden">{workflowName}</h1>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground overflow-hidden">

            <div className="flex items-center gap-2 h-4">
              <Clock className="h-4 w-4" />
              <span>Updated: {format(new Date(), "Pp")}</span>
            </div>
          </div>
        </div>
    </header>
  );
};
