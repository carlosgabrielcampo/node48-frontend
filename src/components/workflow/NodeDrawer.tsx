import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Zap, Database, Mail, Webhook, Search } from "lucide-react";
import { toast } from "sonner";

interface NodeTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
}

interface NodeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectNode: (template: NodeTemplate) => void;
}

const nodeIcons = {
  trigger: Zap,
  action: Database,
  email: Mail,
  webhook: Webhook,
};

export const NodeDrawer = ({ open, onOpenChange, onSelectNode }: NodeDrawerProps) => {
  const [templates, setTemplates] = useState<NodeTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      // Simulating API call - replace with actual endpoint
      // const response = await fetch('/api/workflow/templates');
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockTemplates: NodeTemplate[] = [
        {
          id: "1",
          type: "trigger",
          name: "Webhook Trigger",
          description: "Start workflow when webhook receives data",
        },
        {
          id: "2",
          type: "trigger",
          name: "Schedule Trigger",
          description: "Run workflow on a schedule",
        },
        {
          id: "3",
          type: "action",
          name: "Database Query",
          description: "Execute a database query",
        },
        {
          id: "4",
          type: "email",
          name: "Send Email",
          description: "Send an email notification",
        },
        {
          id: "5",
          type: "webhook",
          name: "HTTP Request",
          description: "Make an HTTP request to an API",
        },
      ];

      setTemplates(mockTemplates);
    } catch (error) {
      toast.error("Failed to load templates");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectNode = (template: NodeTemplate) => {
    onSelectNode(template);
    onOpenChange(false);
    setSearchQuery("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Add Node</SheetTitle>
          <SheetDescription>
            Choose a trigger or action to add to your workflow
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

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-200px)]">
              <div className="space-y-2 pr-4">
                {filteredTemplates.map((template) => {
                  const Icon = nodeIcons[template.type as keyof typeof nodeIcons] || Zap;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleSelectNode(template)}
                      className="w-full p-4 rounded-lg border bg-card hover:bg-accent transition-colors text-left"
                      aria-label={`Add ${template.name} node`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium mb-1">{template.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
