import { NodeConfigPanelProps } from "@/types/panels";
import { useEffect, useRef, useState } from "react";
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
  const [draft, setDraft] = useState<any[]>([]);
  const commitRefs = useRef<Array<(prev: any[]) => any[]>>([]);
  const nodeType = nodeTemplates?.[node?.type]
  useEffect(() => node?.parameters && setDraft(node?.parameters), [node?.parameters])

  const registerCommit = (fn: (prev: any[]) => any[]) => {
    
    if (!commitRefs.current.includes(fn)) {
      commitRefs.current.push(fn);
    }
  };
  
  if (!node) return null;
  const Icon = nodeTemplates[node?.type]?.icon || Cog;
  return (
    <DialogLayout
      open={open} 
      handleClose={() => {
        onUpdate(node.id, draft);
        onOpenChange(false);
      }}

      dialogTitle={
        <div className="flex gap-2">
          <Icon/>
          <div>
            {nodeTemplates[node?.type]?.name || "Configuration"}
            <p onClick={() => copyToClipboard(node.id)} className="text-sm hover:text-muted-foreground/60 text-muted-foreground/80 cursor-pointer">
              {node.id}
            </p>
          </div>
        </div>
      }
      dialogContent={
        <ScrollArea className="h-[calc(100%)]">
          <div className="space-y-4">          
          {
            parametersPanels[node.type]({
              open,
              registerCommit,
              draft: draft,
              setDraft: setDraft,
              panelInfo: nodeType.panelInfo || [],
              panelFormat: nodeType.panelFormat
            })
          }
          </div>
        </ScrollArea>
      }
      classes={{contentClass: "max-w-[600px] h-[95%]"}}
    />
  );
};


