import { NodeConfigPanelProps } from "@/types/panels";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { copyToClipboard } from "@/lib/utils";
import { nodeTemplates } from "../nodes/Templates";
import { DialogLayout } from "../layout/dialog";
import { Cog } from "lucide-react";
import { ChildrenRender } from "./customPanels/ApiConfigPanel";
import { LabeledCard } from "../layout/card";
import { v4 as uuidv4 } from "uuid";
import { UUID } from "crypto";
import { toast } from "sonner";

type RendererProps = {
  open: boolean;
  draft: Record<string, any>;
  panelInfo?: Record<string, any>;
  defaultPanel: Record<string, any>;
  panelFormat?: Record<string, any>;
  setDraft: (v: Record<string, any>) => void;
};

export const NodeConfigPanel = ({ node, open, onOpenChange, onUpdate }: NodeConfigPanelProps) => {
  const [draft, setDraft] = useState<any>({});
  const type = node?.type
  const nodeType = nodeTemplates?.[type]

  useEffect(() => node?.parameters && setDraft(node?.parameters), [node?.parameters, open])
  
  if (!node) return null;

  const Icon = nodeType?.icon || Cog;
  const dialogHeader = <div className="flex gap-2">
    <Icon/>
    <div>
      {nodeType?.name || "Configuration"}
      <p onClick={() => copyToClipboard(node.id)} className="text-sm hover:text-muted-foreground/60 text-muted-foreground/80 cursor-pointer">
        {node.id}
      </p>
    </div>
  </div>

  return (
    <DialogLayout open={open} handleClose={() => { onUpdate(node.id, draft); onOpenChange(false) }} dialogTitle={dialogHeader}  classes={{contentClass: "max-w-[600px] h-[95%]"}}> 
        <ScrollArea className="h-[calc(100%)]">
          <div className="space-y-4">       
            <ConfigPanel draft={draft} setDraft={setDraft} defaultPanel={nodeType.panelInfo || {}} panelFormat={nodeType.panelFormat} open={open} />
          </div>
        </ScrollArea>
    </DialogLayout>
  );
};

const removeAtPath = (root: any, path: (string | number)[]) => {
  const cloned = structuredClone(root);

  let parent = cloned;
  for (let i = 0; i < path.length - 1; i++) {
    parent = parent[path[i]];
  }

  const last = path[path.length - 1];

  // Case 1: parent IS the array
  if (Array.isArray(parent)) {
    if (parent.length <= 1){
      toast.error("Options cannot be empty")
      return cloned;
    }
    parent.splice(last as number, 1);
    return cloned;
  }

  // Case 2: parent[last] IS the array
  if (Array.isArray(parent[last])) {
    if (parent[last].length <= 1){
      toast.error("Options cannot be empty")
      return cloned;
    }
    parent[last].splice(last as number, 1);
    return cloned;
  }

  return cloned;
};


const ConfigPanel = ({draft, setDraft, defaultPanel, panelFormat, open}: RendererProps) => {
  const removeState = (id: UUID, position: (string | number)[]) => {
    setDraft(prev => removeAtPath(prev, position));
  };

  return <LabeledCard label={panelFormat.title} header={ ChildrenRender({draft, setDraft, defaultPanel, schema: panelFormat?.header, open, removeState}) }>
    {
      panelFormat?.children && draft?.length
        ? draft?.map((value: Partial<Record<string, string>>, index: number) => {
            value.render_id = uuidv4()
            const setState = (patch: Partial<Record<string, string>>) => {
              console.log({draft, patch}) 
              return setDraft(draft.map((p, i) => i === index ? { ...p, ...patch } : p ))
            }
            const updateEntry = (bind: string, value: Partial<Record<string, string>>) => setDraft(draft.map((p, i) => i === index ? { ...p, [bind]: value } : p))
            return ChildrenRender({draft: value, setDraft: setState, removeState, commit: updateEntry, defaultPanel, schema: panelFormat?.children, position: [index], open})
        })
        : <div className="text-sm text-muted-foreground">No configuration available.</div>
    }
  </LabeledCard>
}
