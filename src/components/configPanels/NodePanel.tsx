import { NodeConfigPanelProps } from "@/types/configPanels";
import { useEffect, useState } from "react";
import { parametersPanels } from ".";
import { ScrollArea } from "../ui/scroll-area";
import { copyToClipboard } from "@/lib/utils";
import { nodeTemplates } from "../nodes/Templates";
import { DialogLayout } from "../layout/dialog";
import { Cog } from "lucide-react";



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
  const Icon = nodeTemplates[node?.type]?.icon || Cog;
  return (
    <DialogLayout 
      open={open} 
      handleClose={() => { onOpenChange(!open); handleUpdate(); }} 
      dialogTitle={
        <div className="flex gap-2">
          <Icon/>
          <div>
            {nodeTemplates[node?.type]?.name || "Configuration"}
            <p onClick={() => copyToClipboard(node.id)} className="text-sm hover:text-muted-foreground/60 text-muted-foreground/80 cursor-pointer">{node.id}</p>
          </div>
        </div>
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


