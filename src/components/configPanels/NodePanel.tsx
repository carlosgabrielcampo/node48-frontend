import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { WorkflowNode, NodeConfigPanelProps } from "@/types/configPanels";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { parametersPanels } from ".";
import { ScrollArea } from "../ui/scroll-area";
import { copyToClipboard } from "@/lib/utils";
import { nodeTemplates } from "../nodes/Templates";
import { DialogLayout } from "../layout/dialog";


export const NodeConfigPanel = ({
  node,
  open,
  onOpenChange,
  onUpdate,
}: NodeConfigPanelProps) => {
  const [stateConfig, setStateConfig] = useState<any[]>([]);

  useEffect(() => {
    if (!node) {
      setStateConfig([]);
      return;
    }
    const initial = Array.isArray(node.parameters) ? structuredClone(node.parameters): [];
    setStateConfig(initial);
  }, [node?.id, open]);

  const handleUpdate = () => { 
    if (node) {
      onUpdate(node.id, stateConfig); 
    }
  }

  const renderConfigPanel = () => {
    if (!node || !parametersPanels[node.type]) {
      return (
        <div className="text-sm text-muted-foreground">
          No configuration available for {node?.type || 'unknown'} nodes.
        </div>
      );
    }

    return parametersPanels[node.type](stateConfig, setStateConfig);
  };

  if (!node) return null;
  return (
    <DialogLayout 
      open={open} 
      handleClose={() => { onOpenChange(!open); handleUpdate(); }} 
      dialogTitle={
        <div>
          <p className="text-lg font-semibold leading-none  cursor-default tracking-tight"> {nodeTemplates[node?.type]?.name || "Configuration"}</p>
        </div>
      }
      dialogDescription={
          <p onClick={() => copyToClipboard(node.id)} className="text-sm hover:text-muted-foreground/60 text-muted-foreground/80 cursor-pointer">{node.id}</p>
      }
      dialogContent={
        <ScrollArea className="h-[calc(100%)]">
          <div className="space-y-4">          
              {renderConfigPanel()}
          </div>
        </ScrollArea>
      }
      classes={{contentClass: "max-w-[600px] h-[95%]"}}
    />
  );
};


