import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { WorkflowNode, NodeConfigPanelProps } from "@/types/configPanels";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { parametersPanels } from ".";

export const NodeConfigPanel = ({
  node,
  open,
  onOpenChange,
  onUpdate,
}: NodeConfigPanelProps) => {
  // local state holds the editable parameters array
  const [stateConfig, setStateConfig] = useState<any[]>([]);

  // ref mirror for compatibility with panels that expect a ref (stateConfigRef.current)
  const configRef = useRef<any[]>(stateConfig);

  // keep ref in sync with state
  useEffect(() => {
    configRef.current = stateConfig;
  }, [stateConfig]);

  // Initialize or reset stateConfig when node changes or panel opens.
  useEffect(() => {
    if (!node) {
      setStateConfig([]);
      return;
    }

    // if node.parameters is array, clone it to avoid mutating the original object
    const initial = Array.isArray(node.parameters) ? structuredClone(node.parameters): [];
    setStateConfig(initial);
    // update ref immediately as well
    configRef.current = initial;
  }, [node?.id, open]); // re-init when different node selected or panel toggles

  if (!node) return null;

  const handleUpdate = () => {
    // Prefer the ref value to ensure any external ref-based edits are captured
    const payload = configRef.current ?? stateConfig;
    onUpdate(node.id, payload);
  };

  const renderConfigPanel = () => {
    if (!parametersPanels[node.type]) {
      return (
        <div className="text-sm text-muted-foreground">
          No configuration available for {node.type} nodes.
        </div>
      );
    }

    return parametersPanels[node.type](stateConfig, setStateConfig);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            Configure {node.name || node.type}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <div className="space-y-4">
            {renderConfigPanel()}
            <Button size="sm" className="mt-1 w-full" onClick={handleUpdate}>
              Save
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
