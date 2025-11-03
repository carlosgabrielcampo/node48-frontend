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
import { Zap, Cog, Search, Power } from "lucide-react";
import { NodeType } from "@/types/workflow";


interface NodeTypeOption {
  id: string;
  data: {
    mainType: NodeType;
    type: string,
    name: string;
    description: string;
  }
}

interface NodeTypeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectNodeType: ({mainType, type, name}) => void;
}

const nodeTemplates: NodeTypeOption[] = [
    {
    id: "1",
    data: {
      name: "HTML Input",
      description: "Make an HTML input",
      mainType: "trigger",
      type: "trigger",
    }
  },
  {
    id: "2",
    data: {
      mainType: "trigger",
      type: "trigger",
      name: "HTTP Request",
      description: "Make an HTTP API call",
    }
  },
    {
    id: "3",
    data: {
      mainType: "trigger",
      type: "trigger",
      name: "Receive Email",
      description: "Receive an email",
    }
  },
  {
    id: "4",
    data: {
      mainType: "trigger",
      type: "trigger",
      name: "Database Query",
      description: "Execute a database query",
    }
  },
  {
    id: "5",
    data: {
      mainType: "trigger",
      type: "trigger",
      name: "Webhook Trigger",
      description: "Trigger on webhook event",
    }
  },
  {
    id: "6",
    data: {
      mainType: "action",
      type: "action",
      name: "Send Email",
      description: "Send an email notification",
    }
  },
  {
    id: "7",
    data: {
      mainType: "operation",
      type: "operation",
      name: "Filter Data",
      description: "Filter array of items"
    }
  },
  {
    id: "8",
    data: {
      mainType: "operation",
      type: "operation",
      name: "Transform Data",
      description: "Transform data structure",
    }
  },
  {
    id: "9",
    data: {
      mainType: "operation",
      type: "operation",
      name: "Aggregate",
      description: "Aggregate multiple values",
    }
  },
  {
    id: "10",
    data: {
      mainType: "operation",
      type: "condition",
      name: "Conditional branching",
      description: "Conditional branching",
    }
  },
  {
    id: "11",
    data: {
      mainType: "operation",
      type: "condition",
      name: "Condition Node",
      description: "Advanced conditional logic with multiple rules",
    }
  },
  {
    id: "12",
    data: {
      mainType: "action",
      type: "api",
      name: "API Call",
      description: "Make external API requests with custom configuration",
    }
  },
  {
    id: "13",
    data: {
      mainType: "operation",
      type: "loop",
      name: "Loop",
      description: "Iterate over data with format or create operations",
    }
  },
  {
    id: "14",
    data: {
      mainType: "action",
      type: "csv",
      name: "Read CSV",
      description: "Read and parse CSV files",
    }
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
      template.data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.data.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectNode = ({mainType, type, name}) => {
    onSelectNodeType({mainType, type, name});
    onOpenChange(false);
    setSearchQuery("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[400px] sm:w-[540px]">
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
                let Icon =  Cog;
                switch (template.data.mainType) {
                  case "action":
                    Icon = Zap;
                    break;
                  case "trigger":
                    Icon = Power;
                    break;
                }
                return (
                  <button
                    key={template.id}
                    onClick={() => handleSelectNode({mainType: template.data.mainType, type: template.data.type, name: template.data.name})}
                    className="w-full p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                    aria-label={`Add ${template.data.name} node`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10`} >
                        <Icon className={`h-5 w-5 text-primary`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium mb-1">{template.data.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {template.data.description}
                        </p>
                        <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-muted capitalize">
                          {template.data.mainType}
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
