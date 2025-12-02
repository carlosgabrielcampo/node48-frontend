import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { WorkflowNode, NodeConfigPanelProps, Conditionals, CsvConfig } from "@/types/configPanels";
import { parametersPanels } from "./customPanels";
import { Button } from "../ui/button";
import { useState } from "react";
export const NodeConfigPanel = ({
  node,
  open,
  onOpenChange,
  onUpdate,
}: NodeConfigPanelProps) => {

  console.log({node})
  
  const getInitialConfig = (): any => {
    if (Array.isArray(node?.parameters)) {
      const firstParam = node?.parameters[0];
      // Type guard to check if it's a CsvConfig
      return firstParam as any;
    } else {
      return []
    }
    // return defaultConfig;
  };

  const [stateConfig, setConfig] = useState<Partial<WorkflowNode>>([]);
  if (!node) return null;

  const handleUpdate = () => {
    onUpdate(node.id, stateConfig);
  };

  const renderConfigPanel = () => {
    console.log(onOpenChange)
    if(!parametersPanels[node?.type]){
        return (
          <div className="text-sm text-muted-foreground">
            No configuration available for {node?.type} nodes.
          </div>
        );
    } else {
      return parametersPanels[node?.type](stateConfig, setConfig)
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            Configure {node?.name || node?.type}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <div className="space-y-4">
            {renderConfigPanel()}
            <Button size="sm" className="mt-1 w-full" onClick={handleUpdate}>Save</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// const parameters = paramArray[0] || {
  //   baseUrl: "",
  //   endpoint: "",
  //   method: "GET",
  //   headers: {},
  //   body: {},
  //   reponseFormat: "json",
  //   outputVar: "",
  //   nextStepId: "",
  //   errorStepId: ""
  // };

  // const defaultConfig: CsvConfig =  {
  //   filePath: "",
  //   encoding: "utf-8",
  //   type: "csv",
  //   nullValues: [],
  //   chunkSize: 200,
  //   errorPolicy: "skip",
  //   parser: {
  //     escape: "'",
  //     strict: true,
  //     separator: ";",
  //   },
  //   outputVar: "",
  //   nextStepId: ""
  // };