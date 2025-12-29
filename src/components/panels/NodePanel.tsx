import { NodeConfigPanelProps } from "@/types/panels";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { copyToClipboard } from "@/lib/utils";
import { nodeTemplates } from "../nodes/Templates";
import { DialogLayout } from "../layout/dialog";
import { Cog } from "lucide-react";
import { ChildrenRender } from "./PanelRenderer";
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
  connections: Record<string, any>;
};

export const NodeConfigPanel = ({ node, open, onOpenChange, onUpdate }: NodeConfigPanelProps) => {
  const [draft, setDraft] = useState<any>([]);
  const type = node?.type
  const nodeType = nodeTemplates?.[type]
  const connections = node?.connections

  useEffect(() => {
    if(node?.parameters?.length) setDraft(node?.parameters)
    else if(nodeType?.panelInfo) {setDraft([structuredClone(nodeType?.panelInfo)])} 
    else setDraft([])
  }, [node?.parameters, open, nodeType?.panelInfo, connections])
  
  if (!node) return null;

  const Icon = nodeType?.icon || Cog;
  const dialogTitle = <div className="flex gap-2">
    <Icon/>
    <div className="flex flex-col w-full">
      <p className="self-start">{nodeType?.name || "Configuration"}</p>
      <p onClick={() => copyToClipboard(node.id)} className="self-start text-sm hover:text-muted-foreground/60 text-muted-foreground/80 cursor-pointer">{node.id}</p>
    </div>
  </div>

  return (
    <DialogLayout open={open} handleClose={() => { onUpdate(node.id, draft, connections); onOpenChange(false) }} dialogTitle={dialogTitle}  classes={{contentClass: "max-w-[600px] h-[95%]"}}> 
        <ScrollArea className="h-[calc(100%)]">
          <div className="space-y-4">       
            <ConfigPanel connections={connections} draft={draft} setDraft={setDraft} defaultPanel={nodeType.panelInfo || {}} panelFormat={nodeType.panelFormat} open={open} />
          </div>
        </ScrollArea>
    </DialogLayout>
  );
};

const removeAtPath = (root: any, path: (string | number)[], connections: any) => {
  const cloned = structuredClone(root);
  console.log({connections, path})

  let parent = cloned;
  for (let i = 0; i < path.length - 1; i++) parent = parent[path[i]];
  const last = path[path.length - 1];
  if(path.length === 1){
    const connectionLength = Object.keys(connections)
    console.log(connectionLength.length)
    if(connectionLength.length > 1){
      const id = Object.keys(connections)?.[path[0]]
      delete connections?.[id]
    }
  }
  console.log(connections)

  if(Array.isArray(parent)){
    if(parent.length <= 1){
      toast.error("Options cannot be empty")
      return cloned;
    }
    parent.splice(last as number, 1);
    return cloned;
  }
  if (Array.isArray(parent[last])){
    if(parent[last].length <= 1){
      toast.error("Options cannot be empty")
      return cloned;
    }
    parent[last].splice(last as number, 1);
    return cloned;
  }

  return cloned;
};

const ConfigPanel = ({draft, setDraft, defaultPanel, panelFormat, open, connections }: RendererProps) => {
  const { children, title, header } = panelFormat
  const removeState = (position: (string | number)[]) => setDraft(prev => removeAtPath(prev, position, connections))
  const renderProps = { draft, setDraft, defaultPanel, open, removeState, connections }

  return <LabeledCard 
    label={title} 
    header={ ChildrenRender({ schema: header, ...renderProps}) } >
      {/* // draft, setDraft, defaultPanel, schema: header, open, removeState, connections}) }> */}
    {
      children && Array.isArray(draft) ? draft?.map((value: Partial<Record<string, string>>, index: number) => {
            value.render_id = uuidv4()
            const setState = (patch: Partial<Record<string, string>>) => setDraft(draft.map((p, i) => i === index ? { ...p, ...patch } : p ))
            const commit = (bind: string, value: Partial<Record<string, string>>) => setDraft(draft.map((p, i) => i === index ? { ...p, [bind]: value } : p))
            return ChildrenRender({ open, connections, removeState, defaultPanel, draft: value, position: [index], setDraft: setState, commit, schema: children })
        })
        : <div className="text-sm text-muted-foreground">No configuration available.</div>
    }
  </LabeledCard>
}
