import { NodeConfigPanelProps } from "@/types/configPanels";
import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { copyToClipboard } from "@/lib/utils";
import { nodeTemplates } from "../nodes/Templates";
import { DialogLayout } from "../layout/dialog";
import { Cog } from "lucide-react";
import { ChildrenRender } from "./PanelRenderer";
import { LabeledCard } from "../layout/card";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { PanelInfo } from "@/types/panels";
import { Edge } from "reactflow";
import { PanelComponent, PanelFormat } from "@/types/panels";
import { StepParameters } from "@/types/parameters";


type DraftState = StepParameters[];
type PositionPath = Array<string | number>;

type ChildrenRenderProps = {
  open: boolean;
  connections: Record<string, string>;
  removeState: (position: PositionPath) => void;
  defaultPanel: PanelInfo;
  draft: StepParameters;
  position?: PositionPath;
  setDraft: (patch: Partial<Record<string, unknown>>) => void;
  commit?: (bind: string, value: Partial<Record<string, unknown>>) => void;
  schema?: import("@/types/panels").PanelComponent[];
};

export const NodeConfigPanel = ({ node, open, onOpenChange, onUpdate, setEdges }: NodeConfigPanelProps) => {
  const [draft, setDraft] = useState<DraftState>([]);

  const type = node?.type;
  const nodeType = type ? nodeTemplates[type as keyof typeof nodeTemplates] : undefined;
  const connections = node?.connections || {};

  useEffect(() => {
    if (node?.parameters?.length) {
      setDraft(node.parameters);
    } else if (nodeType?.panelInfo) {
      setDraft([structuredClone(nodeType.panelInfo) as StepParameters]);
    } else {
      setDraft([]);
    }
  }, [node?.parameters, open, nodeType?.panelInfo]);

  if (!node) return null;

  const Icon = nodeType?.icon || Cog;
  const dialogTitle = (
    <div className="flex gap-2">
      <Icon />
      <div className="flex flex-col w-full">
        <p className="self-start">{nodeType?.name || "Configuration"}</p>
        <p
          onClick={() => copyToClipboard(node.id)}
          className="self-start text-sm hover:text-muted-foreground/60 text-muted-foreground/80 cursor-pointer"
        >
          {node.id}
        </p>
      </div>
    </div>
  );

  return (
    <DialogLayout
      open={open}
      dialogTitle={dialogTitle}
      classes={{ contentClass: "max-w-[600px] h-[95%]" }}
      handleClose={() => {
        onUpdate(node.id, draft, []);
        onOpenChange(false);
      }}
    >
      <ScrollArea className="h-[calc(100%)]">
        <div className="space-y-4">
          <ConfigPanel
            open={open}
            draft={draft}
            setDraft={setDraft}
            setEdges={setEdges || (() => {})}
            connections={connections}
            panelFormat={nodeType?.panelFormat}
            defaultPanel={nodeType?.panelInfo || {}}
          />
        </div>
      </ScrollArea>
    </DialogLayout>
  );
};

const removeAtPath = (
  root: DraftState,
  path: PositionPath,
  connections: Record<string, string>,
  setEdges: (edge: Edge) => void
): DraftState => {
  const cloned = structuredClone(root);
  let parent: unknown = cloned;

  for (let i = 0; i < path.length - 1; i++) {
    parent = (parent as Record<string | number, unknown>)[path[i]];
  }

  const last = path[path.length - 1];

  if (path.length === 1) {
    const connectionKeys = Object.keys(connections);
    const id = connectionKeys?.[path[0] as number];
    if (connectionKeys.length > 1) {
      setEdges({ id } as Edge);
      delete connections?.[id];
    }
  }

  if (Array.isArray(parent)) {
    if (parent.length <= 1) {
      toast.error("Options cannot be empty");
      return cloned;
    }
    parent.splice(last as number, 1);
    return cloned;
  }

  if (Array.isArray((parent as Record<string | number, unknown>)[last])) {
    const targetArray = (parent as Record<string | number, unknown>)[last] as unknown[];
    if (targetArray.length <= 1) {
      toast.error("Options cannot be empty");
      return cloned;
    }
    targetArray.splice(last as number, 1);
    return cloned;
  }

  return cloned;
};

const ConfigPanel = ({
  draft,
  setDraft,
  defaultPanel,
  panelFormat,
  open,
  connections,
  setEdges
}: RendererProps) => {
  const { children, title, header } = panelFormat || {};

  const removeState = (position: PositionPath) =>
    setDraft((prev: DraftState) => removeAtPath(prev, position, connections, setEdges));

  // Type-safe wrapper for ChildrenRender
  const renderChildren = (props: {
    draft: Record<string, unknown>;
    setDraft: (patch: Record<string, unknown>) => void;
    defaultPanel: import("@/types/panels").PanelComponent;
    schema?: import("@/types/panels").PanelComponent[];
    open: boolean;
    removeState: (position: PositionPath) => void;
    connections: import("@/types/configPanels").WorkflowConnection;
    position?: PositionPath;
    commit?: (bind: string, value: Record<string, unknown>) => void;
  }) => {
    // Cast to match the expected interface from PanelRenderer
    return (ChildrenRender as (props: typeof props) => React.ReactNode)(props);
  };

  return (
    <LabeledCard
      label={title}
      header={
        header ?
          renderChildren({
            draft: (draft[0] as Record<string, unknown>) || {},
            setDraft: (updatedDraft: Record<string, unknown>) => setDraft([updatedDraft as StepParameters]),
            defaultPanel,
            schema: header,
            open,
            removeState,
            connections
          }) :
          undefined
      }
    >
      {
        children && Array.isArray(draft) ? draft?.map((value: StepParameters, index: number) => {
          const renderId = uuidv4();
          (value as Record<string, unknown>).render_id = renderId;

          const setState = (patch: Record<string, unknown>) =>
            setDraft(draft.map((p: StepParameters, i: number) => i === index ? { ...p, ...patch } : p));

          const commit = (bind: string, patch: Record<string, unknown>) => {
            setDraft(draft.map((p: StepParameters, i: number) => i === index ? { ...p, [bind]: patch } : p));
          };

          return renderChildren({
            open,
            connections,
            removeState,
            defaultPanel,
            draft: value as Record<string, unknown>,
            position: [index],
            setDraft: setState,
            commit,
            schema: children
          });
        }) :
        <div className="text-sm text-muted-foreground">No configuration available.</div>
      }
    </LabeledCard>
  );
};
