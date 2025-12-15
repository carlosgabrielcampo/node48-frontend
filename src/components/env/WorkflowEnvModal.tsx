import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Globe,
  Workflow,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useEnv } from "@/contexts/EnvContext";
import { EnvProfile, EnvValues, EnvDiff } from "@/types/env";
import { EnvKeyEditor } from "./EnvKeyEditor";
import { toast } from "sonner";

interface WorkflowEnvModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string;
}

export const WorkflowEnvModal = ({
  open,
  onOpenChange,
  workflowId,
}: WorkflowEnvModalProps) => {
  const {
    projectEnvs,
    activeProjectEnvId,
    workflowEnvMeta,
    loadWorkflowEnvs,
    createWorkflowEnv,
    updateWorkflowEnv,
    deleteWorkflowEnv,
    setWorkflowActiveEnv,
    getEnvDiff,
  } = useEnv();

  // Local state for editing
  const [selectedEnvId, setSelectedEnvId] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<EnvProfile | null>(null);
  const [localValues, setLocalValues] = useState<EnvValues>({});
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [newProfileName, setNewProfileName] = useState("");
  const [showOnlyOverrides, setShowOnlyOverrides] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [maskedKeys, setMaskedKeys] = useState<Set<string>>(new Set());

  // Load workflow envs on mount
  useEffect(() => {
    if (open && workflowId) {
      loadWorkflowEnvs(workflowId);
    }
  }, [open, workflowId, loadWorkflowEnvs]);

  // Initialize selected env
  useEffect(() => {
    if (workflowEnvMeta) {
      setSelectedEnvId(workflowEnvMeta.activeEnvId || activeProjectEnvId || null);
    }
  }, [workflowEnvMeta, activeProjectEnvId]);

  // Reset when profile changes
  useEffect(() => {
    if (editingProfile) {
      setLocalValues({ ...editingProfile.values });
      setMaskedKeys(new Set(Object.keys(editingProfile.values)));
      setIsDirty(false);
    }
  }, [editingProfile]);

  const handleValuesChange = useCallback((newValues: EnvValues) => {
    setLocalValues(newValues);
    setIsDirty(true);
  }, []);

  const handleEnvSwitch = useCallback((envId: string) => {
    if (isDirty) {
      setPendingAction(() => () => {
        setSelectedEnvId(envId);
        setIsDirty(false);
      });
      setShowConfirmDiscard(true);
    } else {
      setSelectedEnvId(envId);
    }
  }, [isDirty]);

  const handleClose = useCallback(() => {
    if (isDirty) {
      setPendingAction(() => () => onOpenChange(false));
      setShowConfirmDiscard(true);
    } else {
      onOpenChange(false);
    }
  }, [isDirty, onOpenChange]);

  const handleSave = async () => {
    if (!editingProfile || !workflowId) return;

    try {
      await updateWorkflowEnv(workflowId, editingProfile.id, {
        values: localValues,
      });
      setIsDirty(false);
      toast.success("Environment saved");
    } catch (error) {
      toast.error("Failed to save environment");
    }
  };

  const handleSaveAndClose = async () => {
    await handleSave();
    onOpenChange(false);
  };

  const handleDiscard = () => {
    if (editingProfile) {
      setLocalValues({ ...editingProfile.values });
    }
    setIsDirty(false);
    setShowConfirmDiscard(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleSaveFromConfirm = async () => {
    await handleSave();
    setShowConfirmDiscard(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleCreateProfile = async () => {
    if (!newProfileName.trim() || !workflowId) return;

    try {
      const newEnv = await createWorkflowEnv(workflowId, {
        name: newProfileName.trim(),
        values: {},
      });
      setNewProfileName("");
      setEditingProfile(newEnv);
      toast.success("Environment profile created");
    } catch (error) {
      toast.error("Failed to create profile");
    }
  };

  const handleDeleteProfile = async (envId: string) => {
    if (!workflowId) return;

    try {
      await deleteWorkflowEnv(workflowId, envId);
      if (editingProfile?.id === envId) {
        setEditingProfile(null);
      }
      toast.success("Environment profile deleted");
    } catch (error) {
      toast.error("Failed to delete profile");
    }
  };

  const handleSetActive = async () => {
    if (!workflowId) return;

    try {
      await setWorkflowActiveEnv(workflowId, selectedEnvId);
      toast.success("Active environment updated");
    } catch (error) {
      toast.error("Failed to set active environment");
    }
  };

  const copyToClipboard = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const toggleMask = (key: string) => {
    setMaskedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  // Get computed diff
  const envDiff = getEnvDiff(workflowId);
  const filteredDiff = showOnlyOverrides
    ? envDiff.filter((d) => d.source === "workflow")
    : envDiff;
  const hasOverrides = envDiff.some((d) => d.source === "workflow");

  // Find environments
  const activeProjectEnv = projectEnvs.find((e) => e.id === activeProjectEnvId);
  const defaultEnv = projectEnvs.find((e) => e.isDefault);
  const currentProjectEnv = activeProjectEnv || defaultEnv;
  const workflowProfiles = workflowEnvMeta?.envProfiles || [];

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Workflow Environment Configuration
            </DialogTitle>
            <DialogDescription>
              Configure environment variables for this workflow. Workflow overrides take precedence over project defaults.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="active" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Environment</TabsTrigger>
              <TabsTrigger value="profiles">Workflow Profiles</TabsTrigger>
              <TabsTrigger value="preview">
                Resolved Preview
                {hasOverrides && (
                  <Badge variant="secondary" className="ml-2 h-5">
                    {envDiff.filter((d) => d.source === "workflow").length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Active Environment Tab */}
            <TabsContent value="active" className="flex-1 space-y-4 mt-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Active Environment</Label>
                  <Select value={selectedEnvId || ""} onValueChange={handleEnvSwitch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment..." />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        Project Environments
                      </div>
                      {projectEnvs.map((env) => (
                        <SelectItem key={env.id} value={env.id}>
                          <span className="flex items-center gap-2">
                            <Globe className="h-3 w-3" />
                            {env.name}
                            {env.isDefault && (
                              <Badge variant="outline" className="text-xs">
                                Default
                              </Badge>
                            )}
                          </span>
                        </SelectItem>
                      ))}
                      {workflowProfiles.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground mt-2">
                            Workflow Overrides
                          </div>
                          {workflowProfiles.map((env) => (
                            <SelectItem key={env.id} value={env.id}>
                              <span className="flex items-center gap-2">
                                <Workflow className="h-3 w-3" />
                                {env.name}
                              </span>
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEnvId !== workflowEnvMeta?.activeEnvId && (
                  <Button onClick={handleSetActive} className="w-full">
                    Set as Active for Workflow
                  </Button>
                )}

                {hasOverrides && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-500">Workflow Override Active</p>
                      <p className="text-muted-foreground">
                        This workflow has custom environment values that override project defaults.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Current Project Environment</Label>
                  <div className="p-3 rounded-lg bg-muted/50 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4" />
                      <span className="font-medium">{currentProjectEnv?.name || "None"}</span>
                      {currentProjectEnv?.isDefault && (
                        <Badge variant="secondary">Default</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Object.keys(currentProjectEnv?.values || {}).length} variables defined
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Workflow Profiles Tab */}
            <TabsContent value="profiles" className="flex-1 flex flex-col min-h-0 mt-4">
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="New profile name..."
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateProfile()}
                />
                <Button onClick={handleCreateProfile} disabled={!newProfileName.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </div>

              {workflowProfiles.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div className="space-y-2">
                    <Workflow className="h-12 w-12 mx-auto text-muted-foreground/50" />
                    <p className="text-muted-foreground">No workflow-specific profiles</p>
                    <p className="text-sm text-muted-foreground">
                      Create a profile to override project environment values
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4 flex-1 min-h-0">
                  {/* Profile List */}
                  <div className="w-48 space-y-2">
                    <Label className="text-xs text-muted-foreground">Profiles</Label>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-1 pr-2">
                        {workflowProfiles.map((profile) => (
                          <div
                            key={profile.id}
                            className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                              editingProfile?.id === profile.id
                                ? "bg-primary/10 border border-primary/30"
                                : "hover:bg-muted"
                            }`}
                            onClick={() => setEditingProfile(profile)}
                          >
                            <span className="text-sm truncate">{profile.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteProfile(profile.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Profile Editor */}
                  <div className="flex-1 border rounded-lg p-4 min-h-0">
                    {editingProfile ? (
                      <div className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-medium">{editingProfile.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              {Object.keys(localValues).length} variables
                              {isDirty && (
                                <Badge variant="destructive" className="ml-2">
                                  Unsaved
                                </Badge>
                              )}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            onClick={handleSave}
                            disabled={!isDirty}
                          >
                            Save Changes
                          </Button>
                        </div>
                        <ScrollArea className="flex-1">
                          <EnvKeyEditor
                            values={localValues}
                            onChange={handleValuesChange}
                          />
                        </ScrollArea>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        Select a profile to edit
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Resolved Preview Tab */}
            <TabsContent value="preview" className="flex-1 flex flex-col min-h-0 mt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Label>Resolved Environment Values</Label>
                  <Badge variant="outline">{envDiff.length} total</Badge>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={showOnlyOverrides}
                    onChange={(e) => setShowOnlyOverrides(e.target.checked)}
                    className="rounded"
                  />
                  Show only overrides
                </label>
              </div>

              <ScrollArea className="flex-1 border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Key</TableHead>
                      <TableHead>Project Value</TableHead>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Workflow Override</TableHead>
                      <TableHead>Resolved</TableHead>
                      <TableHead className="w-[80px]">Source</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDiff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          {showOnlyOverrides
                            ? "No workflow overrides"
                            : "No environment variables defined"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDiff.map((diff) => (
                        <TableRow
                          key={diff.key}
                          className={diff.source === "workflow" ? "bg-yellow-500/5" : ""}
                        >
                          <TableCell className="font-mono text-sm font-medium">
                            {diff.key}
                          </TableCell>
                          <TableCell className="font-mono text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              {maskedKeys.has(diff.key)
                                ? "••••••••"
                                : diff.projectValue || "-"}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => toggleMask(diff.key)}
                              >
                                {maskedKeys.has(diff.key) ? (
                                  <Eye className="h-3 w-3" />
                                ) : (
                                  <EyeOff className="h-3 w-3" />
                                )}
                              </Button>
                            </span>
                          </TableCell>
                          <TableCell>
                            {diff.source === "workflow" && (
                              <ArrowRight className="h-4 w-4 text-yellow-500" />
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {diff.workflowOverride !== undefined ? (
                              <span className="text-yellow-500">
                                {maskedKeys.has(diff.key)
                                  ? "••••••••"
                                  : diff.workflowOverride}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm font-medium">
                            <span className="flex items-center gap-1">
                              {maskedKeys.has(diff.key)
                                ? "••••••••"
                                : diff.resolvedValue}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() =>
                                  copyToClipboard(diff.key, diff.resolvedValue)
                                }
                              >
                                {copiedKey === diff.key ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={diff.source === "workflow" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {diff.source}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSaveAndClose} disabled={!isDirty}>
              Save & Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Confirmation */}
      <AlertDialog open={showConfirmDiscard} onOpenChange={setShowConfirmDiscard}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes to the environment profile. What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingAction(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDiscard}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard Changes
            </AlertDialogAction>
            <AlertDialogAction onClick={handleSaveFromConfirm}>
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
