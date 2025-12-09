import { CsvConfigPanelProps, CsvConfig } from "@/types/configPanels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { SetStateAction, useState } from "react";
import { LabeledInput } from "@/components/layout/input";
import { LabeledCheckbox } from "@/components/layout/checkbox";

export const CsvConfigPanel = ({ state, setState }: CsvConfigPanelProps) => {
  const defaultConfig: CsvConfig =  {
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
    outputVar: "",
    nextStepId: ""
  };
  
  // Handle parameters as array (JSON format) or object (legacy)
  const getInitialConfig = (): CsvConfig => {
    if (Array.isArray(state)) {
      const firstParam = state[0];
      // Type guard to check if it's a CsvConfig
      if (firstParam && 'filePath' in firstParam && 'encoding' in firstParam) {
        return firstParam as CsvConfig;
      }
    }
    return defaultConfig;
  };
  
  const [stateConfig, setConfig] = useState<CsvConfig>(getInitialConfig());

  const updateConfig = (updates: Partial<CsvConfig>) => {
    setConfig([{ ...stateConfig, ...updates }])
  };

  const addNullValue = () => {
    updateConfig({ nullValues: [...stateConfig.nullValues, ""] });
  };

  const removeNullValue = (index: number) => {
    updateConfig({ nullValues: stateConfig.nullValues.filter((_, i) => i !== index) });
  };

  const updateNullValue = (index: number, value: string) => {
    const updated = [...stateConfig.nullValues];
    updated[index] = value;
    updateConfig({ nullValues: updated });
  };

  return (
    <div className="space-y-4">
      <LabeledInput 
        label="File Path"
        value={stateConfig.filePath}
        onChange={(e) => updateConfig({ filePath: e.target.value })}
        placeholder="_test/mock/database/Autorizados.csv"
        className="mt-1"
      />
      <LabeledInput 
        label="Encoding"
        value={stateConfig.encoding}
        onChange={(e) => updateConfig({ encoding: e.target.value })}
        placeholder="utf-8"
        className="mt-1"
      />
      <LabeledInput 
        label="Chunk Size"
        value={stateConfig.chunkSize}
        onChange={(e) => updateConfig({ chunkSize: parseInt(e.target.value) || 200 })}
        className="mt-1"
        type="number"
      />
      <LabeledInput 
        label="Error Policy"
        value={stateConfig.errorPolicy}
        onChange={(e) => updateConfig({ errorPolicy: e.target.value })}
        placeholder="skip"
        className="mt-1"
      />
      <LabeledInput 
        label="Output Variable"
        value={stateConfig.outputVar || ""}
        onChange={(e) => updateConfig({ outputVar: e.target.value })}
        placeholder="Autorizados"
        className="mt-1"
      />

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Null Values</Label>
          <Button onClick={addNullValue} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {stateConfig.nullValues.map((value, index) => (
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
            value={stateConfig.parser.escape}
            onChange={(e) => updateConfig({ parser: { ...stateConfig.parser, escape: e.target.value } })}
            placeholder="'"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-xs">Separator</Label>
          <Input
            value={stateConfig.parser.separator}
            onChange={(e) => updateConfig({ parser: { ...stateConfig.parser, separator: e.target.value } })}
            placeholder=";"
            className="mt-1"
          />
        </div>
        <LabeledCheckbox 
          id={"strict"}
          checked={stateConfig.parser.strict}
          onCheckedChange={(checked) => updateConfig({ parser: { ...stateConfig.parser, strict: checked === true } })}
          label={"Strict Mode"}
        />
      </Card>
    </div>
  );
};
