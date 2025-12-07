import { v4 as uuidv4 } from 'uuid';
import { Edge } from 'reactflow';

export function createEdge({ connection }: NodeType){
      const newEdge: Edge = {
        ...connection,
        id: uuidv4(),
        type: "custom",
        animated: false,
        style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "hsl(var(--primary))",
        },
      };
}