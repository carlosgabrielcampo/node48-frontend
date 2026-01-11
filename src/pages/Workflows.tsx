import { useState, Dispatch, SetStateAction } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowCard } from "@/components/workflow/WorkflowCard";
import { CreateWorkflowDialog } from "@/components/workflow/CreateWorkflowDialog";
import { useToast } from "@/hooks/useToast";
import { workflowService } from "@/services/workflow/WorkflowService";
import { Workflow } from "@/types/workflows";

const WorkflowsPage = () => {
  const [createDialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workflowDialog, setWorkflowDialog ] = useState({name: "", description: ""})
  const [mode, setMode] = useState("create")
  const { toast } = useToast();

  const { data: workflows = [], isLoading, refetch } = useQuery<Workflow[]>({
    queryKey: ["workflows"],
    queryFn: workflowService.getAll
  });

  const updateMutation = useMutation({
    mutationFn: workflowService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update workflow. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: workflowService.create,
    onSuccess: (newWorkflow: Workflow) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
      navigate(`/workflows/${newWorkflow.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create workflow. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: workflowService.delete,
    onSuccess: (newWorkflow: Workflow) => {
      queryClient.invalidateQueries({ queryKey: ["workflows"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete workflow. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshed",
      description: "Workflow list has been refreshed.",
    });
  };

  const handleWorkflow = async (data: Partial<Workflow>) => {
    return mode === "create" ? await createMutation.mutateAsync({...workflowDialog, ...data}) : await updateMutation.mutateAsync({...workflowDialog, ...data})
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <main className="flex-1 overflow-y-auto">
        <div className="container max-w-1xl py-8 px-6">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">Workflows</h1>
                <p className="text-muted-foreground mt-2">
                  Manage and create your automation workflows
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button onClick={() => {setDialogOpen(true); setWorkflowDialog({name: "", description: ""}); setMode('create')}}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Workflow
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : workflows.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No workflows yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by creating your first workflow
                </p>
                <Button onClick={() => { 
                  setDialogOpen(true); 
                  setWorkflowDialog({name: "", description: ""}); 
                  setMode('create')
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Workflow
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflows.map((workflow) => (
                  <WorkflowCard
                    key={workflow.id}
                    workflow={workflow}
                    onClick={() => navigate(`/workflows/${workflow.id}`)}
                    setMode={setMode}
                    setWorkflowDialog={setWorkflowDialog}
                    setDialogOpen={() => setDialogOpen(true)}
                    deleteWorkflow={deleteMutation.mutateAsync}
                  />
                ))}
              </div>
            )}
          </div>
          <CreateWorkflowDialog
            open={createDialogOpen}
            onOpenChange={setDialogOpen}
            mode={mode}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            card={workflowDialog}
            onSuccess={handleWorkflow}
          />
        </div>
      </main>
    </div>
  );
};

export default WorkflowsPage;
