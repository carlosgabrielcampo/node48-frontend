import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Cog, Trash2 } from "lucide-react";
import { nodeTemplates } from "./Templates";

interface DefaultNodeData {
  name: string;
  type: string; // Actual node type string like "conditional_operation", "api_call", etc.
  mainType: string;
  onDelete: (id: string) => void;
  onClick?: (data: any) => void;
  config?: any[];
  connections: any[];
  errorStepId?: string;
  nextStepId?: string;
}

export const DefaultNode = memo(({ id, data, selected }: NodeProps<DefaultNodeData>) => {
  const Icon = nodeTemplates[data.type]?.icon || Cog;
  const outputHandles = Object.entries(data.connections).map(([source, target]) => {return {source, target}});;
  const nodeHeight = 80 + (outputHandles.length > 2 ? (outputHandles.length - 2) * 30 : 0);

  return (
    <div
      style={{ minHeight: `${nodeHeight}px` }}
      className={`rounded-lg border-2 bg-node-hover min-h-[100px] shadow-lg transition-all w-[200px] cursor-pointer relative ${
        selected 
          ? "border-primary shadow-xl ring-2 ring-primary/20" 
          : "border-node-border hover:border-primary/50 hover:bg-node-hover"
      }`}
    >
      {/* Input Handle */}
      <div className="absolute bg-primary h-[50px]">
        <Handle
          type="target"
          position={Position.Left}
          id={id}
          className=" top-50 !bg-primary z-50 !w-3 !h-3 !border-2 !border-background"
        />
      </div>

      {/* Node Content */}
      <div className="p-3">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-1 min-w-0">
              <Icon className="h-4 w-4 text-primary" />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold text-foreground truncate">
                {nodeTemplates[data.type]?.name}
              </span>

            </div>
          </div>
          <button
            onClick={() => { data.onClick?.(data) }}
            className="h-6 w-6 rounded hover:bg-primary/10 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Acess node settings"
          >
            <Cog className="h-3 w-3 text-muted-foreground hover:text-primary" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); data.onDelete(id); }}
            className="h-6 w-6 rounded hover:bg-destructive/10 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Delete node"
          >
            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-1 mb-2">
        {outputHandles.map(({source, target}, index) => {
          const totalHandles = outputHandles.length;        
          return (
            <div key={source} className="flex  relative min-w-[100%] h-[40px]  justify-center items-center">
              <div className="rounded-lg min-w-[90%] border-2 h-[90%]  border-2  items-center">
                
              </div>
              <Handle
                type="source"
                id={source}
                position={Position.Right}
                className="!bg-primary !w-3 !h-3 !border-2 !border-background"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
});

DefaultNode.displayName = "DefaultNode";
