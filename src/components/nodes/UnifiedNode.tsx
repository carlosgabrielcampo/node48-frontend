import { memo, useState, useCallback, useEffect } from "react";
import { Handle, Position, NodeProps, useUpdateNodeInternals } from "reactflow";
import { ChevronDown, ChevronRight, Cog, Trash2 } from "lucide-react";
import { nodeTemplates } from "./Templates";

interface OutputHandle {
  source: string;
  target: string;
}

interface UnifiedNodeData {
  name: string;
  type: string;
  onDelete: (id: string) => void;
  onClick?: (data: any) => void;
  connections: Record<string, string>;
  parameters?: any[];
  collapsed?: boolean;
}

export const UnifiedNode = memo(({ id, data, selected }: NodeProps<UnifiedNodeData>) => {
  const [isCollapsed, setIsCollapsed] = useState(data.collapsed ?? false);
  const updateNodeInternals = useUpdateNodeInternals();
  
  const Icon = nodeTemplates[data.type]?.icon || Cog;
  const nodeName = data.name || nodeTemplates[data.type]?.name || "Node";
  
  // Build output handles from connections
  const outputHandles: OutputHandle[] = Object.entries(data.connections || {}).map(
    ([source, target]) => ({ source, target: target as string })
  );
  
  // Ensure at least one output handle
  const handles = outputHandles.length > 0 ? outputHandles : [{ source: "default", target: "" }];

  // Toggle collapse state
  const toggleCollapse = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    setIsCollapsed((prev) => !prev);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleCollapse(e);
    }
  }, [toggleCollapse]);

  // Update node internals after collapse/expand for handle repositioning
  useEffect(() => {
    requestAnimationFrame(() => {
      updateNodeInternals(id);
    });
  }, [isCollapsed, id, updateNodeInternals]);

  // Collapsed state - compact pill
  if (isCollapsed) {
    return (
      <div
        onDoubleClick={() => data.onClick?.({id, ...data})}
        className={`justify-center rounded-lg border-2 bg-slate-800 shadow-lg transition-all duration-200 ease-in-out cursor-pointer relative flex items-center gap-2 px-3 py-2 min-w-[80px] h-[80px] ${
          selected
            ? "border-primary shadow-xl ring-2 ring-primary/20"
            : "border-slate-700 hover:border-primary/50"
        }`}
      >
        {/* Input Handle - centered */}
        <Handle
          type="target"
          position={Position.Left}
          id={id}
          className="!bg-primary !w-3 !h-3 !border-2 !border-slate-800"
        />

        {/* Expand button */}
        {/* <button
          onClick={toggleCollapse}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-expanded={false}
          aria-label="Expand node"
          className="h-5 w-5 rounded hover:bg-slate-700 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <ChevronRight className="h-3 w-3 text-slate-400" />
        </button> */}

        {/* Icon and short label */}
        <Icon className="h-6 w-6 text-primary flex-shrink-0" onClick={toggleCollapse}/>
        
        <span className="text-center absolute text-xs font-medium text-white w-[80px] top-[80px] left-0 justify-center items-center">
          {nodeName}
        </span>
        {/* Output Handles - stacked vertically centered */}
        {handles.map((handle, index) => {
          const totalHandles = handles.length;
          const spacing = 12;
          const totalHeight = (totalHandles - 1) * spacing;
          const offset = index * spacing - totalHeight / 2;
          
          return (
            <Handle
              key={handle.source}
              type="source"
              id={handle.source}
              position={Position.Right}
              style={{ top: `calc(50% + ${offset}px)` }}
              className="!bg-primary !w-3 !h-3 !border-2 !border-slate-800"
            />
          );
        })}
      </div>
    );
  }

  // Expanded state - full node
  const nodeHeight = 80 + (handles.length > 1 ? (handles.length - 1) * 40 : 0);

  return (
    <div
      onDoubleClick={() => data.onClick?.(data)}
      style={{ minHeight: `${nodeHeight}px` }}
      className={`rounded-lg border-2 bg-slate-800 shadow-lg shadow-black/20 transition-all duration-200 ease-in-out w-[220px] cursor-pointer relative ${
        selected
          ? "border-primary shadow-xl ring-2 ring-primary/20"
          : "border-slate-700 hover:border-primary/50"
      }`}
    >
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id={id}
        style={{ top: "32px" }}
        className="!bg-primary !w-3 !h-3 !border-2 !border-slate-800"
      />

      {/* Node Header */}
      <div className="p-3 border-b border-slate-700/50" >
        <div className="flex items-center gap-2">
          {/* Collapse button */}
          {/* <button
            onClick={toggleCollapse}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            aria-expanded={true}
            aria-label="Collapse node"
            className="h-6 w-6 rounded hover:bg-slate-700 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button> */}

          {/* Icon */}
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon className="h-4 w-4 text-primary" onClick={toggleCollapse} />
          </div>

          {/* Title */}
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold text-white truncate block">
              {nodeName}
            </span>
            <span className="text-xs text-slate-400 truncate block">
              {data.type}
            </span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => data.onClick?.(data)}
              className="h-6 w-6 rounded hover:bg-slate-700 flex items-center justify-center transition-colors"
              aria-label="Node settings"
            >
              <Cog className="h-3 w-3 text-slate-400 hover:text-primary" />
            </button>
          </div>
        </div>
      </div>

      {/* Output Handles with labels */}
      <div className="flex flex-col py-2">
        {handles.map((handle, index) => (
          <div
            key={handle.source}
            className="flex items-center justify-between px-3 py-1.5 relative min-h-[36px]"
          >
            {/* Handle label */}
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500 bg-slate-700/50 rounded px-1.5 py-0.5">
                  {index + 1}
                </span>
                <span className="text-xs text-slate-400 truncate">
                  {handle.source ? `${handle.source}` : "Output"}
                </span>
              </div>
            </div>

            {/* Output Handle */}
            <Handle
              type="source"
              id={handle.source}
              position={Position.Right}
              className="!bg-primary !w-3 !h-3 !border-2 !border-slate-800 !relative !transform-none !top-auto !right-auto"
              style={{ position: "relative", right: "-12px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

UnifiedNode.displayName = "UnifiedNode";
