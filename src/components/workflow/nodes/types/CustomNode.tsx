import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Cog, Trash2 } from "lucide-react";
import { nodeTemplates } from "../Templates";

interface CustomNodeData {
  name: string;
  type: string; // Actual node type string like "conditional_operation", "api_call", etc.
  mainType: string;
  onDelete: (id: string) => void;
  onClick?: (id: string) => void;
  config?: any[];
  errorStepId?: string;
  nextStepId?: string;
}

export const CustomNode = memo(({ id, data, selected }: NodeProps<CustomNodeData>) => {
  const Icon = nodeTemplates[data.type]?.icon || Cog;
  
  // Calculate dynamic output handles
  const getOutputHandles = () => {
    const handles = [];
    
    // For conditional_operation and loop_operation with config arrays
    if ((data.type === "conditional_operation" || data.type === "loop_operation") && Array.isArray(data.config)) {
      // Add handle for each config entry
      data.config.forEach((configItem, index) => {
        handles.push({
          id: configItem.nextStepId || `output-${index}`,
          label: configItem.name || `Output ${index + 1}`,
          position: index,
        });
      });
      
      // Add default/fallback handle for conditional
      if (data.type === "conditional_operation" && data.nextStepId) {
        handles.push({
          id: data.nextStepId,
          label: "Não atende nenhuma das condições",
          position: handles.length,
        });
      }
    } 
    // For api_call with success and error outputs
    else if (data.type === "api_call") {
      if (data.nextStepId) {
        handles.push({
          id: data.nextStepId,
          label: "Success",
          position: 0,
        });
      }
      if (data.errorStepId) {
        handles.push({
          id: data.errorStepId,
          label: "Error",
          position: 1,
        });
      }
    }
    // Default single handle
    else if (data.nextStepId) {
      handles.push({
        id: data.nextStepId,
        label: "Next",
        position: 0,
      });
    }
    
    return handles;
  };

  const outputHandles = getOutputHandles();
  const nodeHeight = 80 + (outputHandles.length > 2 ? (outputHandles.length - 2) * 30 : 0);

  return (
    <div
      onClick={() => data.onClick?.(id)}
      style={{ minHeight: `${nodeHeight}px` }}
      className={`rounded-lg border-2 bg-node-background shadow-lg transition-all min-w-[200px] cursor-pointer relative ${
        selected 
          ? "border-primary shadow-xl ring-2 ring-primary/20" 
          : "border-node-border hover:border-primary/50 hover:bg-node-hover"
      }`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary !w-3 !h-3 !border-2 !border-background"
      />

      {/* Node Content */}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-primary/10 flex-shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold text-foreground truncate">
                {data.name || nodeTemplates[data.type]?.name}
              </span>
              <span className="text-xs text-muted-foreground">
                {nodeTemplates[data.type]?.name}
              </span>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); data.onDelete(id); }}
            className="h-6 w-6 rounded hover:bg-destructive/10 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Delete node"
          >
            <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>

      {/* Dynamic Output Handles */}
      {outputHandles.map((handle, index) => {
        const totalHandles = outputHandles.length;
        const verticalSpacing = totalHandles > 1 ? (100 / (totalHandles + 1)) : 50;
        const topPosition = `${verticalSpacing * (index + 1)}%`;
        
        return (
          <div key={handle.id} className="relative">
            <Handle
              type="source"
              id={handle.id}
              position={Position.Right}
              style={{ top: topPosition }}
              className="!bg-connection-line !w-3 !h-3 !border-2 !border-background"
            />
            {totalHandles > 1 && (
              <div
                style={{ top: topPosition }}
                className="absolute right-4 -translate-y-1/2 text-xs text-muted-foreground bg-node-background px-2 py-0.5 rounded border border-node-border whitespace-nowrap pointer-events-none"
              >
                {handle.label}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
});

CustomNode.displayName = "CustomNode";
