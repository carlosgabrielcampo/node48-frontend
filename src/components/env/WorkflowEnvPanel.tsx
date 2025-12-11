import { useEffect, useState } from "react";
import { useEnv } from "@/contexts/EnvContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertTriangle } from "lucide-react";
import { EnvKeyEditor } from "./EnvKeyEditor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WorkflowEnvPanelProps {
  workflowId: string;
}

export const WorkflowEnvPanel = ({ workflowId }: WorkflowEnvPanelProps) => {
  const {
    projectEnvs,
    activeProjectEnvId,
    workflowEnvMeta,
    loadWorkflowEnvs,
    createWorkflowEnv,
    updateWorkflowEnv,
    deleteWorkflowEnv,
    getEnvDiff,
  } = useEnv();

  const [newEnvName, setNewEnvName] = useState("");
  const [newEnvDialogOpen, setNewEnvDialogOpen] = useState(false);

  useEffect(() => {
    loadWorkflowEnvs(workflowId);
  }, [workflowId, loadWorkflowEnvs]);

  const envDiff = getEnvDiff(workflowId);
  const activeProjectEnv = projectEnvs.find((e) => e.id === activeProjectEnvId);
  const hasOverrides = envDiff.some((d) => d.source === "workflow");

  const handleCreateEnv = async () => {
    if (!newEnvName.trim()) return;
    await createWorkflowEnv(workflowId, {
      name: newEnvName.trim(),
      values: {},
    });
    setNewEnvName("");
    setNewEnvDialogOpen(false);
  };

  const handleUpdateEnvValues = async (envId: string, values: Record<string, string>) => {
    await updateWorkflowEnv(workflowId, envId, { values });
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      {hasOverrides && (
        <div className="flex items-center gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <span className="text-sm">
            This workflow has environment overrides that differ from the project default.
          </span>
        </div>
      )}

      {/* Resolved Values Diff Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resolved Environment Values</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Project Value</TableHead>
                <TableHead>Workflow Override</TableHead>
                <TableHead>Resolved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {envDiff.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No environment variables defined
                  </TableCell>
                </TableRow>
              ) : (
                envDiff.map((diff) => (
                  <TableRow key={diff.key}>
                    <TableCell className="font-mono text-sm">{diff.key}</TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {diff.projectValue || "-"}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {diff.workflowOverride !== undefined ? (
                        <Badge variant="secondary">{diff.workflowOverride || '""'}</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm font-medium">
                      <Badge variant={diff.source === "workflow" ? "default" : "outline"}>
                        {diff.resolvedValue}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Workflow-specific Environments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Workflow Environment Profiles</CardTitle>
          <Dialog open={newEnvDialogOpen} onOpenChange={setNewEnvDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Override Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Workflow Environment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={newEnvName}
                    onChange={(e) => setNewEnvName(e.target.value)}
                    placeholder="e.g., Workflow Override"
                    className="mt-1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewEnvDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEnv} disabled={!newEnvName.trim()}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {workflowEnvMeta?.envProfiles.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No workflow-specific environments. Create one to override project values.
            </p>
          ) : (
            <div className="space-y-4">
              {workflowEnvMeta?.envProfiles.map((env) => (
                <Card key={env.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{env.name}</span>
                      {workflowEnvMeta.activeEnvId === env.id && (
                        <Badge variant="default">Active</Badge>
                      )}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteWorkflowEnv(workflowId, env.id)}
                    >
                      Delete
                    </Button>
                  </div>
                  <EnvKeyEditor
                    values={env.values}
                    onChange={(values) => handleUpdateEnvValues(env.id, values)}
                  />
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
