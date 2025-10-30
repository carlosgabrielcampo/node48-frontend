import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Zap, Cog, Trash2 } from "lucide-react";
import { NodeType } from "@/types/workflow";

interface CustomNodeData {
  name: string;
  type: NodeType;
  onDelete: (id: string) => void;
}

export const CustomNode = memo(({ id, data, selected }: NodeProps<CustomNodeData>) => {
  const isAction = data.type === "action";
  const Icon = isAction ? Zap : Cog;

  return (
    <div
      className={`rounded-lg border-2 bg-card shadow-lg transition-all ${
        selected 
          ? "border-primary shadow-xl ring-2 ring-primary/20" 
          : "border-border hover:border-primary/50"
      } ${isAction ? "min-w-[180px]" : "min-w-[180px]"}`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary !w-3 !h-3 !border-2 !border-background"
      />

      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                isAction ? "bg-primary/10" : "bg-secondary/10"
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  isAction ? "text-primary" : "text-secondary"
                }`}
              />
            </div>
            <span className="text-sm font-semibold text-foreground">
              {data.name}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete(id);
            }}
            className="h-6 w-6 rounded hover:bg-destructive/10 flex items-center justify-center transition-colors"
            aria-label="Delete node"
          >
            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
        
        <div className="text-xs text-muted-foreground capitalize">
          {data.type}
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary !w-3 !h-3 !border-2 !border-background"
      />
    </div>
  );
});

CustomNode.displayName = "CustomNode";
