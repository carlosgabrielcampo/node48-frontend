import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkflowNode } from "./WorkflowNode";

interface Node {
  id: string;
  type: string;
  label: string;
  position: { x: number; y: number };
}

interface WorkflowCanvasProps {
  nodes: Node[];
  onAddNode: () => void;
  onNodeMove: (nodeId: string, position: { x: number; y: number }) => void;
}

export const WorkflowCanvas = ({ nodes, onAddNode, onNodeMove }: WorkflowCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleNodeMouseDown = (
    nodeId: string,
    e: React.MouseEvent,
    nodePosition: { x: number; y: number }
  ) => {
    e.preventDefault();
    setDraggingNode(nodeId);
    setDragOffset({
      x: e.clientX - nodePosition.x,
      y: e.clientY - nodePosition.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingNode) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onNodeMove(draggingNode, { x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  return (
    <div
      ref={canvasRef}
      className="flex-1 relative overflow-auto bg-canvas"
      style={{
        backgroundImage: `radial-gradient(circle, hsl(var(--canvas-grid)) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      role="region"
      aria-label="Workflow canvas"
      tabIndex={0}
    >
      {nodes.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onAddNode}
            className="gap-2"
            aria-label="Add first workflow step"
          >
            <Plus className="h-5 w-5" />
            Add first step
          </Button>
        </div>
      ) : (
        <>
          {nodes.map((node) => (
            <WorkflowNode
              key={node.id}
              id={node.id}
              type={node.type}
              label={node.label}
              position={node.position}
              onMouseDown={(e) => handleNodeMouseDown(node.id, e, node.position)}
              isDragging={draggingNode === node.id}
            />
          ))}
        </>
      )}
    </div>
  );
};
