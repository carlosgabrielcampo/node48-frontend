import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Zap, Cog, Search } from "lucide-react";

interface NodeTypeOption {
  id: string;
  type: "action" | "operation";
  name: string;
  description: string;
}

interface NodeTypeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectNodeType: (type: "action" | "operation", name: string) => void;
}

const nodeTemplates: NodeTypeOption[] = [
  {
    id: "1",
    type: "action",
    name: "HTTP Request",
    description: "Make an HTTP API call",
  },
  {
    id: "2",
    type: "action",
    name: "Send Email",
    description: "Send an email notification",
  },
  {
    id: "3",
    type: "action",
    name: "Database Query",
    description: "Execute a database query",
  },
  {
    id: "4",
    type: "action",
    name: "Webhook Trigger",
    description: "Trigger on webhook event",
  },
  {
    id: "5",
    type: "operation",
    name: "Filter Data",
    description: "Filter array of items",
  },
  {
    id: "6",
    type: "operation",
    name: "Transform Data",
    description: "Transform data structure",
  },
  {
    id: "7",
    type: "operation",
    name: "Aggregate",
    description: "Aggregate multiple values",
  },
  {
    id: "8",
    type: "operation",
    name: "Condition",
    description: "Conditional branching",
  },
];

export const NodeTypeDrawer = ({
  open,
  onOpenChange,
  onSelectNodeType,
}: NodeTypeDrawerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTemplates = nodeTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectNode = (template: NodeTypeOption) => {
    onSelectNodeType(template.type, template.name);
    onOpenChange(false);
    setSearchQuery("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Add Node</SheetTitle>
          <SheetDescription>
            Choose an action or operation to add to your workflow
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              aria-label="Search workflow nodes"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2 pr-4">
              {filteredTemplates.map((template) => {
                const Icon = template.type === "action" ? Zap : Cog;
                const isAction = template.type === "action";
                
                return (
                  <button
                    key={template.id}
                    onClick={() => handleSelectNode(template)}
                    className="w-full p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                    aria-label={`Add ${template.name} node`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isAction ? "bg-primary/10" : "bg-secondary/10"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            isAction ? "text-primary" : "text-secondary"
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium mb-1">{template.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-muted capitalize">
                          {template.type}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};
