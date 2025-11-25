export interface NodeType {
    id: string, 
    position: {x: number, y: number}, 
    type: string, 
    connections: Record<string, string>, 
    onDelete: (id: string) => void, 
    onClick: (id: string) => void 
}