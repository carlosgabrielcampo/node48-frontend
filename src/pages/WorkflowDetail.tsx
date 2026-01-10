import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Workflow from "./Workflow";
import { workflowService } from "@/services/workflow/workflowStorage";

const WorkflowDetail = () => {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const { data: workflow, isLoading, error } = useQuery({
    queryKey: ["workflow", id],
    queryFn: () => workflowService.getById(id!),
    enabled: !!id,
  });
  useEffect(() => {
    if (error || (!isLoading && !workflow)) {
      navigate("/workflows");
    }
  }, [error, isLoading, workflow, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen bg-background flex items-center justify-center">
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
    <div className="h-screen w-screen bg-background">
      <Workflow workflow={workflow}/>
    </div>
  );
};

export default WorkflowDetail;
