import { memo } from "react";
import { Handle, Position, NodeProps,  } from "reactflow";
import { Zap, Cog, Trash2, Power } from "lucide-react";
import { NodeType } from "@/types/workflow";

interface CustomNodeData {
  name: string;
  type: NodeType;
  onDelete: (id: string) => void;
}

export const CustomNode = memo(({ id, type, data, selected }: NodeProps<CustomNodeData>) => {
  console.log({ id, type, data, selected })
  let Icon = Cog
  switch (type) {
    case "action":
      Icon = Zap;
      break;
    case "trigger": 
      Icon = Power;
      break;
  }

  const DEFAULT_HANDLE_STYLE = {
    width: 10,
    height: 10,
    bottom: -5,
  };

  return (
    <div
      className={`rounded-lg border-2 bg-card shadow-lg transition-all h-[120px] min-w-[180px] ${
        selected 
          ? "border-primary shadow-xl ring-2 ring-primary/20" 
          : "border-border hover:border-primary/50"
      }`}
    >
      {/* Input Handle */}
      {type !== 'trigger' && <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary !w-3 !h-3 !border-2 !border-background"
      />}

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center bg-primary/10`}>
              <Icon className={`h-4 w-4 text-primary`} />
            </div>
            <span className="text-sm font-semibold text-foreground"> {data.name} </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); data.onDelete(id); }}
            className="h-6 w-6 rounded hover:bg-destructive/10 flex items-center justify-center transition-colors"
            aria-label="Delete node"
          >
            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
        <div className="text-xs text-muted-foreground capitalize">
          {type}
        </div>
      </div>

      {/* Output Handle */}
        <Handle
          type="source"
          id="red"
          position={Position.Right}
          style={{ ...DEFAULT_HANDLE_STYLE, top: '67.5%', background: 'red' }}
          onConnect={(params) => console.log('handle onConnect', params)}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="blue"
          style={{ ...DEFAULT_HANDLE_STYLE, top: '50%', background: 'blue' }}
          onConnect={(params) => console.log('handle onConnect', params)}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="orange"
          style={{ ...DEFAULT_HANDLE_STYLE, top: '85%', background: 'orange' }}
          onConnect={(params) => console.log('handle onConnect', params)}
        />
    </div>
  );
});

CustomNode.displayName = "CustomNode";
