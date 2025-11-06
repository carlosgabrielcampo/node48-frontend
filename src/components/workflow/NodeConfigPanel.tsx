import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { WorkflowNode } from "@/types/workflow";
import { ConditionConfigPanel } from "./config-panels/ConditionConfigPanel";
import { ApiConfigPanel } from "./config-panels/ApiConfigPanel";
import { LoopConfigPanel } from "./config-panels/LoopConfigPanel";
import { CsvConfigPanel } from "./config-panels/CsvConfigPanel";

interface NodeConfigPanelProps {
  node: WorkflowNode | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (nodeId: string, updates: Partial<WorkflowNode>) => void;
}

export const NodeConfigPanel = ({
  node,
  open,
  onOpenChange,
  onUpdate,
}: NodeConfigPanelProps) => {
  if (!node) return null;

  const handleUpdate = (updates: Partial<WorkflowNode>) => {
    onUpdate(node.id, updates);
  };

  const renderConfigPanel = () => {
    switch (node?.data?.type) {
      case "conditional_operation":
        return <ConditionConfigPanel node={node} onUpdate={handleUpdate} />;
      case "api_call":
        return <ApiConfigPanel node={node} onUpdate={handleUpdate} />;
      case "loop_operation":
        return <LoopConfigPanel node={node} onUpdate={handleUpdate} />;
      case "read_csv":
        return <CsvConfigPanel node={node} onUpdate={handleUpdate} />;
      default:
        return (
          <div className="text-sm text-muted-foreground">
            No configuration available for {node?.type} nodes.
          </div>
        );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            Configure {node.data.name || node.data.type}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          {renderConfigPanel()}
        </div>
      </SheetContent>
    </Sheet>
  );
};
