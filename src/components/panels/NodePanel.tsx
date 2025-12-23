import { NodeConfigPanelProps } from "@/types/panels";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { copyToClipboard } from "@/lib/utils";
import { nodeTemplates } from "../nodes/Templates";
import { DialogLayout } from "../layout/dialog";
import { Cog } from "lucide-react";
import { ChildrenRender } from "./customPanels/ApiConfigPanel";
import { LabeledCard } from "../layout/card";

type RendererProps = {
  draft: Record<string, any>;
  panelInfo?: Record<string, any>;
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
            <ConfigPanel draft={draft} setDraft={setDraft} panelInfo={nodeType.panelInfo || []} panelFormat={nodeType.panelFormat} />
          </div>
        </ScrollArea>
    </DialogLayout>
  );
};

const ConfigPanel = ({draft, setDraft, panelInfo, panelFormat}: RendererProps) => {
  return <LabeledCard label={panelFormat.title} header={
      panelFormat.header 
        ? <ChildrenRender draft={draft} setDraft={setDraft} schema={panelFormat?.header} /> 
        : null
    }>
    { 
      panelFormat?.children && draft?.length ? draft?.map((value: Partial<Record<string, string>>, index: number) => {
            const setState = (patch: Partial<Record<string, string>>) => 
              setDraft(draft.map((p, i) => i === index ? { ...p, ...patch } : p ))
            const updateEntry = (bind: string, value: Partial<Record<string, string>>) => 
              setDraft(draft.map((p, i) => i === index ? { ...p, [bind]: value } : p))
            return <ChildrenRender draft={value} setDraft={setState} schema={panelFormat?.children} commit={updateEntry} position={[["default", index]]}/>
        })
        : <div className="text-sm text-muted-foreground">No configuration available.</div>
    }
  </LabeledCard>
}
