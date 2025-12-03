import { v4 as uuidv4 } from 'uuid';
import { NodeType } from '@/types/node';
export function createEmptyNode({type, onDelete, onClick}) {
    return createNode({
        id: uuidv4(),
        position: {
            x: Math.random() * 400 + 100,
            y: Math.random() * 300 + 100,
        },
        type,
        onDelete,
        onClick,
        connections: { [uuidv4()]: "" }
    })
}

export function createNode({ id, position, type, connections, onDelete, onClick, ...step }: NodeType){
    const node = {
        id: id,
        type: "custom",
        position: position,
        data: {
            ...step,
            connections,
            type,
            onDelete,
            onClick,
        }
    }
    return node
}