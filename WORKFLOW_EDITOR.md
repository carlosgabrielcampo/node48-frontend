# Node-Based Workflow Editor

## Solution Overview

Built an interactive workflow editor using **React Flow** library for professional node connection handling, drag-and-drop, and visual linking.

## Component Structure

```
src/
├── types/
│   └── workflow.ts              # TypeScript interfaces
├── components/workflow/
│   ├── FlowEditor.tsx           # Main canvas with ReactFlow
│   ├── CustomNode.tsx           # Individual node component
│   └── NodeTypeDrawer.tsx       # Node selection drawer
└── pages/
    └── Workflow.tsx             # Page container
```

## TypeScript Interfaces

```typescript
// Node types
export type NodeType = "action" | "operation" | "trigger";

export interface WorkflowNode {
  id: string;
  name: string;
  position: { x: number; y: number };
  data: []
}

// Connection types
export interface WorkflowConnection {
  id: string;
  source: {
    nodeId: string;
    outputIndex: number;
  };
  target: {
    nodeId: string;
    inputIndex: number;
  };
}

// Serialized workflow
export interface WorkflowData {
  nodes: WorkflowNode[];
  connections: WorkflowConnection[];
}
```

## Features Implemented

### Nodes
- ✅ Add nodes via drawer or quick-add buttons
- ✅ Drag and reposition nodes
- ✅ Delete nodes (click trash icon or keyboard Delete/Backspace)
- ✅ Visual distinction between Action (primary color) and Operation (secondary color)
- ✅ Each node has: id, type, name, position

### Categories
- ✅ **Action nodes**: Primary color (blue), Zap icon
- ✅ **Operation nodes**: Secondary color, Cog icon
- ✅ Clear visual separation with colors and icons

### Connections
- ✅ Create connections by dragging from output handle to input handle
- ✅ Animated connection lines
- ✅ Prevents self-connections
- ✅ Delete connections (select and press Delete/Backspace)
- ✅ Arrow markers on connections
- ✅ Each connection stores: id, source (nodeId, outputIndex), target (nodeId, inputIndex)

### State Management
- ✅ Full workflow serializes to JSON with nodes and connections
- ✅ Import workflow from JSON file
- ✅ Export workflow to JSON file
- ✅ See `example-workflow.json` for format

### Interactions
- ✅ Selecting nodes highlights them with border and ring
- ✅ Selecting connections highlights them
- ✅ Keyboard Delete/Backspace to remove selected elements
- ✅ Toolbar shows node and connection counts
- ✅ Toast notifications for all actions
- ✅ Mini-map for navigation
- ✅ Zoom controls
- ✅ Pan canvas by dragging background

## JSON Import/Export

### Export
Click "Export" button to download workflow as JSON file.

### Import
Click "Import" button and select a JSON file matching the WorkflowData format.

### Example JSON Structure
See `example-workflow.json` in project root for a complete example with 3 nodes and 2 connections.

## Usage

1. **Add Node**: Click "Add Node" button to open drawer, select node type
2. **Connect Nodes**: Drag from bottom handle (source) to top handle (target) of another node
3. **Move Nodes**: Drag nodes to reposition
4. **Delete**: Select element and press Delete/Backspace, or click trash icon on node
5. **Export/Import**: Use toolbar buttons to save/load workflows

## Validation
- Prevents self-connections (node connecting to itself)
- Shows error toasts for invalid operations
- Validates JSON structure on import

## Suggestions for Improvement

1. **Circular Connection Prevention**: Add graph traversal to detect cycles
2. **Multiple Input/Output Ports**: Extend nodes to have multiple connection points
3. **Node Configuration Panel**: Add right sidebar for editing node properties
4. **Undo/Redo**: Implement command pattern for history management
5. **Auto-Layout**: Add algorithm to automatically arrange nodes
6. **Zoom to Selection**: Add button to focus on selected nodes
7. **Connection Labels**: Add ability to label connections
8. **Node Groups**: Allow grouping related nodes together
9. **Copy/Paste**: Implement clipboard operations for nodes
10. **Keyboard Shortcuts**: Add shortcuts for common operations (Ctrl+S save, etc.)
