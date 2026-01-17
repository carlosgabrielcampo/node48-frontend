import { Edge, MarkerType } from 'reactflow';

export function createEdge({ id, source, sourceHandle, target }: Edge){
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