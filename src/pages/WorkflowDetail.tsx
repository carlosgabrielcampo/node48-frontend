import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { workflowService } from "@/services/workflowService";
import Workflow from "./Workflow";

const WorkflowDetail = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { data: workflow, isLoading, error } = useQuery({
    queryKey: ["workflow", id],
    queryFn: () => workflowService.getWorkflow(id!),
    enabled: !!id,
  });
  useEffect(() => {
    if (error || (!isLoading && !workflow)) {
      navigate("/workflows");
    }
  }, [error, isLoading, workflow, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading workflow...</p>
        </div>
      </div>
    );
  }

  if (!workflow) {
    return null;
  }
  
  return (
    <div className="h-screen bg-background">
      <Workflow workflow={workflow}/>
    </div>
  );
};

export default WorkflowDetail;
