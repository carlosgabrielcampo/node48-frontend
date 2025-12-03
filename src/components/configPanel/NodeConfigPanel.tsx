import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NodeConfigPanelProps } from "@/types/configPanels";
import { parametersPanels } from "./customPanels";
import { Button } from "../ui/button";
import { useEffect, useRef, useState } from "react";
import { PenBox } from "lucide-react";
export const NodeConfigPanel = ({
  node,
  open,
  onOpenChange,
  onUpdate,
}: NodeConfigPanelProps) => {
  const [stateConfig, setStateConfig] = useState<any[]>([]);
  
  useEffect(() => {
    if (!node) {
      setStateConfig([]);
      return;
    } else {
      setStateConfig(node.parameters);
    }
  }, [node?.id, open, node])

  const handleUpdate = () => {
    onUpdate(node.id, {parameters: stateConfig});
  };


 const renderConfigPanel = (stateConfig, setStateConfig) => {
    if (!parametersPanels[node.type]) {
      return (
        <div className="text-sm text-muted-foreground">
          No configuration available for {node.type} nodes.
        </div>
      );
    }
    return parametersPanels[node.type](stateConfig, setStateConfig);
  };
  
  if (!node) return null;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-center gap-2">
              {node?.name || ""}
              <PenBox className="h-4 w-4 text-muted-foreground"/>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <div className="space-y-4">
            {renderConfigPanel(stateConfig, setStateConfig)}
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