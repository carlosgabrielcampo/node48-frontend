import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { WorkflowNode, NodeConfigPanelProps } from "@/types/configPanels";
import { parametersPanels } from "./";

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

    if(!parametersPanels[node?.type]){
        return (
          <div className="text-sm text-muted-foreground">
            No configuration available for {node?.type} nodes.
          </div>
        );
    } else {
      return parametersPanels[node?.type](node, handleUpdate)
    }
  };
  console.log({Sheet: node})
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <p>Configure {node?.name || node?.type}</p>
          </SheetTitle>
          <p className="text-sm">{node.id}</p>
        </SheetHeader>
        <div className="mt-6">
          {renderConfigPanel()}
        </div>
      </SheetContent>
    </Sheet>
  );
};
