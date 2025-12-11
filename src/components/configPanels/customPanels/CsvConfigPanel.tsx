import { CsvConfigPanelProps, CsvConfig } from "@/types/configPanels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { LabeledInput } from "@/components/layout/input";
import { LabeledCheckbox } from "@/components/layout/checkbox";
import { LabeledCard } from "@/components/layout/card";

export const CsvConfigPanel = ({ state, setState }: CsvConfigPanelProps) => {
  const defaultConfig: CsvConfig = {
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

  const updateConfig = (index: number, updates: Partial<CsvConfig>) => {
    const updated = [...state];
    updated[index] = { ...updated[index], ...updates };
    setState(updated);
  };

  const addNullValue = (index: number) => {
    const updated = [...state];
    updated[index] = { ...updated[index], nullValues: [...updated[index].nullValues, ""] };
    setState(updated);
  };

  const removeNullValue = (configIndex: number, nullIndex: number) => {
    const updated = [...state];
    updated[configIndex] = {
      ...updated[configIndex],
      nullValues: updated[configIndex].nullValues.filter((_, i) => i !== nullIndex)
    };
    setState(updated);
  };

  const updateNullValue = (configIndex: number, nullIndex: number, value: string) => {
    const updated = [...state];
    const nullValues = [...updated[configIndex].nullValues];
    nullValues[nullIndex] = value;
    updated[configIndex] = { ...updated[configIndex], nullValues };
    setState(updated);
  };

  // Ensure we have at least one config entry
  const configs = state.length > 0 ? state : [defaultConfig];

  return (
    <LabeledCard
      label={"CSV Configuration"}
      headerChildren={<></>}
      cardChildren={
        configs.map((config, index) => (
          <div key={index} className="space-y-4 p-3">
            <LabeledInput 
              label="File Path"
              value={config.filePath}
              onChange={(e) => updateConfig(index, { filePath: e.target.value })}
              placeholder="_test/mock/database/Autorizados.csv"
              className="mt-1"
            />
            <LabeledInput 
              label="Encoding"
              value={config.encoding}
              onChange={(e) => updateConfig(index, { encoding: e.target.value })}
              placeholder="utf-8"
              className="mt-1"
            />
            <LabeledInput 
              label="Chunk Size"
              value={config.chunkSize}
              onChange={(e) => updateConfig(index, { chunkSize: parseInt(e.target.value) || 200 })}
              className="mt-1"
            />
            <LabeledInput 
              label="Error Policy"
              value={config.errorPolicy}
              onChange={(e) => updateConfig(index, { errorPolicy: e.target.value })}
              placeholder="skip"
              className="mt-1"
            />
            <LabeledInput 
              label="Output Variable"
              value={config.outputVar || ""}
              onChange={(e) => updateConfig(index, { outputVar: e.target.value })}
              placeholder="Autorizados"
              className="mt-1"
            />
            <LabeledCard
              label={"Null Values"}
              headerChildren={
                <div className="flex items-center justify-between">
                  <Button onClick={() => addNullValue(index)} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              }
              cardChildren={config.nullValues.map((value, nullIndex) => (
                <div key={nullIndex} className="flex gap-2">
                  <Input
                    value={value}
                    onChange={(e) => updateNullValue(index, nullIndex, e.target.value)}
                    placeholder='""'
                    className="flex-1"
                  />
                  <Button onClick={() => removeNullValue(index, nullIndex)} size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            />

            <Card className="p-4 space-y-3">
              <Label className="font-semibold">Parser Settings</Label>
              <LabeledInput 
                label="Escape Character"
                value={config.parser.escape}
                onChange={(e) => updateConfig(index, { parser: { ...config.parser, escape: e.target.value } })}
                placeholder="'"
                className="mt-1"
              />
              <LabeledInput 
                label="Separator"
                value={config.parser.separator}
                onChange={(e) => updateConfig(index, { parser: { ...config.parser, separator: e.target.value } })}
                placeholder=";"
                className="mt-1"
              />
              <LabeledCheckbox 
                id={`strict-${index}`}
                checked={config.parser.strict}
                onCheckedChange={(checked) => updateConfig(index, { parser: { ...config.parser, strict: checked === true } })}
                label={"Strict Mode"}
              />
            </Card>
          </div>
        ))
      }
    />
  );
};
