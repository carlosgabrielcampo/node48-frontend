import { v4 as uuidv4 } from 'uuid';
import { Edge, MarkerType } from 'reactflow';


export function createEdge({ id, source, sourceHandle, target, label }: Edge){
    return {
        id,
        source,
        sourceHandle,
        target,
        type: "smoothstep",
        animated: false,
        
        style: { 
            color: "hsl(var(--connection-line))",
            stroke: "hsl(var(--connection-line))", 
            strokeWidth: 2
            
        },
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "hsl(var(--connection-line))",
        },
    };
}