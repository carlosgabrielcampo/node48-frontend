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
import { LabeledCard } from "@/components/layout/card";

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
  
  // const [state[0], setConfig] = useState<CsvConfig>(getInitialConfig());

  const updateConfig = (updates: Partial<CsvConfig>) => {
    setState([{ ...state[0], ...updates }])
  };

  const addNullValue = () => {
    updateConfig({ nullValues: [...state[0].nullValues, ""] });
  };

  const removeNullValue = (index: number) => {
    updateConfig({ nullValues: state[0].nullValues.filter((_, i) => i !== index) });
  };

  const updateNullValue = (index: number, value: string) => {
    const updated = [...state[0].nullValues];
    updated[index] = value;
    updateConfig({ nullValues: updated });
  };

  return (
    <LabeledCard
      label={"CSV Configuration"}
      headerChildren={<></>}
      cardChildren={ 
        state.map((state) => 
          <div key={state.filePath} className="space-y-4 p-3">
            <LabeledInput 
              label="File Path"
              value={state.filePath}
              onChange={(e) => updateConfig({ filePath: e.target.value })}
              placeholder="_test/mock/database/Autorizados.csv"
              className="mt-1"
            />
            <LabeledInput 
              label="Encoding"
              value={state.encoding}
              onChange={(e) => updateConfig({ encoding: e.target.value })}
              placeholder="utf-8"
              className="mt-1"
            />
            <LabeledInput 
              label="Chunk Size"
              value={state.chunkSize}
              onChange={(e) => updateConfig({ chunkSize: parseInt(e.target.value) || 200 })}
              className="mt-1"
              type="number"
            />
            <LabeledInput 
              label="Error Policy"
              value={state.errorPolicy}
              onChange={(e) => updateConfig({ errorPolicy: e.target.value })}
              placeholder="skip"
              className="mt-1"
            />
            <LabeledInput 
              label="Output Variable"
              value={state.outputVar || ""}
              onChange={(e) => updateConfig({ outputVar: e.target.value })}
              placeholder="Autorizados"
              className="mt-1"
            />
            <LabeledCard
              label={"Null Values"}
              headerChildren={
                <div className="flex items-center justify-between">
                  <Button onClick={addNullValue} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              }
              cardChildren={ state.nullValues.map((value, index) => (
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
            />

            <Card className="p-4 space-y-3">
              <Label className="font-semibold">Parser Settings</Label>
              <LabeledInput 
                label="Escape Character"
                value={state.parser.escape}
                onChange={(e) => updateConfig({ parser: { ...state.parser, escape: e.target.value } })}
                placeholder="'"
                className="mt-1"
              />
              <LabeledInput 
                label="Separator"
                value={state.parser.separator}
                onChange={(e) => updateConfig({ parser: { ...state.parser, separator: e.target.value } })}
                placeholder=";"
                className="mt-1"
              />
              <LabeledCheckbox 
                id={"strict"}
                checked={state.parser.strict}
                onCheckedChange={(checked) => updateConfig({ parser: { ...state.parser, strict: checked === true } })}
                label={"Strict Mode"}
              />
            </Card>
          </div>
        )
      }
    />
  )
};
