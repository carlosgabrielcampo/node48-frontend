import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { WorkflowTopBarProps } from "@/types/workflows";


export const WorkflowTopBar = ({ workflowName = "Untitled Workflow" }: WorkflowTopBarProps) => {
  const navigate = useNavigate()
  return (
    <header className="h-14 border-b bg-background flex items-center justify-between p-4 z-40">
        <div className="flex flex-row justify-between items-center w-[100%] gap-1">
          <div className="">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/workflows")}
            >
              <ArrowLeft className="" />
            </Button>
          </div>
            <div className="flex-1 ml-1">
              <h1 className="text-2xl font-bold">{workflowName}</h1>
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
