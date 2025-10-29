import { Zap, Database, Mail, Webhook } from "lucide-react";

interface WorkflowNodeProps {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
  onMouseDown: (e: React.MouseEvent) => void;
  isDragging: boolean;
}

const nodeIcons = {
  trigger: Zap,
  action: Database,
  email: Mail,
  webhook: Webhook,
};

export const WorkflowNode = ({
  type,
  label,
  position,
  onMouseDown,
  isDragging,
}: WorkflowNodeProps) => {
  const Icon = nodeIcons[type as keyof typeof nodeIcons] || Zap;

  return (
    <div
      className={`absolute bg-node border border-node-border rounded-lg shadow-sm hover:bg-node-hover hover:shadow-md transition-all cursor-move ${
        isDragging ? "opacity-70 shadow-lg" : ""
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: "180px",
      }}
      onMouseDown={onMouseDown}
      role="button"
      tabIndex={0}
      aria-label={`${label} node`}
    >
      <div className="p-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{label}</p>
          <p className="text-xs text-muted-foreground capitalize">{type}</p>
        </div>
      </div>
      
      {/* Connection points */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-connection rounded-full border-2 border-background" />
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-connection rounded-full border-2 border-background" />
    </div>
  );
};
