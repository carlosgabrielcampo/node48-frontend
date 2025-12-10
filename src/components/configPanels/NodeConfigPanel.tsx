import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { WorkflowNode, NodeConfigPanelProps } from "@/types/configPanels";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { parametersPanels } from ".";
import { ScrollArea } from "../ui/scroll-area";
import { copyToClipboard } from "@/lib/utils";
import { nodeTemplates } from "../nodes/Templates";


export const NodeConfigPanel = ({
  node,
  open,
  onOpenChange,
  onUpdate,
}: NodeConfigPanelProps) => {
  const [stateConfig, setStateConfig] = useState<any[]>([]);
  const configRef = useRef<any[]>(stateConfig);

  useEffect(() => { configRef.current = stateConfig }, [stateConfig]);

  useEffect(() => {
    if (!node) {
      setStateConfig([]);
      return;
    }
    const initial = Array.isArray(node.parameters) ? structuredClone(node.parameters): [];
    setStateConfig(initial);
    configRef.current = initial;
  }, [node?.id, open]);

  const handleUpdate = () => { onUpdate(node.id, stateConfig); }

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

  if (!node) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[550px] h-full sm:max-w-[550px]">
          <SheetHeader>
            <SheetTitle className="h-[54px] flex flex-col">
              <p>{nodeTemplates[node?.type]?.name || "Configuration"}</p>
              <p onClick={() => copyToClipboard(node.id)} className="text-sm hover:text-muted-foreground/60 text-muted-foreground/80">{node.id}</p>
            </SheetTitle>
          </SheetHeader>
            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="space-y-4">          
                  {renderConfigPanel()}
              </div>
            </ScrollArea>
            <div className="flex w-full">
              <Button size="sm" className="mt-1 w-[calc(100%)]" onClick={handleUpdate}>
                Save
              </Button>
          </div>
        </SheetContent>
      </Sheet>
  );
};
