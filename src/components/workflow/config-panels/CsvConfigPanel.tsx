import { WorkflowNode, CsvConfig } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

interface CsvConfigPanelProps {
  node: WorkflowNode;
  onUpdate: (updates: Partial<WorkflowNode>) => void;
}

export const CsvConfigPanel = ({ node, onUpdate }: CsvConfigPanelProps) => {
  const config = (node.config as CsvConfig) || {
    filePath: "",
    encoding: "utf-8",
    type: "csv",
    nullValues: [],
    chunkSize: 200,
    errorPolicy: "skip",
    parser: {
      escape: "'",
      strict: true,
      separator: ";",
    },
  };

  const updateConfig = (updates: Partial<CsvConfig>) => {
    onUpdate({ config: { ...config, ...updates } });
  };

  const addNullValue = () => {
    updateConfig({ nullValues: [...config.nullValues, ""] });
  };

  const removeNullValue = (index: number) => {
    updateConfig({ nullValues: config.nullValues.filter((_, i) => i !== index) });
  };

  const updateNullValue = (index: number, value: string) => {
    const updated = [...config.nullValues];
    updated[index] = value;
    updateConfig({ nullValues: updated });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>File Path</Label>
        <Input
          value={config.filePath}
          onChange={(e) => updateConfig({ filePath: e.target.value })}
          placeholder="_test/mock/database/Autorizados.csv"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Encoding</Label>
        <Input
          value={config.encoding}
          onChange={(e) => updateConfig({ encoding: e.target.value })}
          placeholder="utf-8"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Type</Label>
        <Input
          value={config.type}
          onChange={(e) => updateConfig({ type: e.target.value })}
          placeholder="csv"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Chunk Size</Label>
        <Input
          type="number"
          value={config.chunkSize}
          onChange={(e) => updateConfig({ chunkSize: parseInt(e.target.value) || 200 })}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Error Policy</Label>
        <Input
          value={config.errorPolicy}
          onChange={(e) => updateConfig({ errorPolicy: e.target.value })}
          placeholder="skip"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Output Variable</Label>
        <Input
          value={node.outputVar || ""}
          onChange={(e) => onUpdate({ outputVar: e.target.value })}
          placeholder="Autorizados"
          className="mt-1"
        />
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Null Values</Label>
          <Button onClick={addNullValue} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {config.nullValues.map((value, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => updateNullValue(index, e.target.value)}
              placeholder='""'
              className="flex-1"
            />
            <Button onClick={() => removeNullValue(index)} size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </Card>

      <Card className="p-4 space-y-3">
        <Label className="font-semibold">Parser Settings</Label>
        
        <div>
          <Label className="text-xs">Escape Character</Label>
          <Input
            value={config.parser.escape}
            onChange={(e) => updateConfig({ parser: { ...config.parser, escape: e.target.value } })}
            placeholder="'"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-xs">Separator</Label>
          <Input
            value={config.parser.separator}
            onChange={(e) => updateConfig({ parser: { ...config.parser, separator: e.target.value } })}
            placeholder=";"
            className="mt-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="strict"
            checked={config.parser.strict}
            onCheckedChange={(checked) => updateConfig({ parser: { ...config.parser, strict: checked === true } })}
          />
          <Label htmlFor="strict" className="text-xs cursor-pointer">
            Strict Mode
          </Label>
        </div>
      </Card>

      <div>
        <Label>Next Step ID</Label>
        <Input
          value={node.nextStepId || ""}
          onChange={(e) => onUpdate({ nextStepId: e.target.value })}
          placeholder="Node ID"
          className="mt-1"
        />
      </div>
    </div>
  );
};
