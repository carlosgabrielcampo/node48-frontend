import { ConfigPanelProps, CsvConfig } from "@/types/configPanels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, PenBox } from "lucide-react";
import { useState } from "react";
export const CsvConfigPanel = ({ stateConfig, setConfig }: ConfigPanelProps) => {
  const state = stateConfig[0]
  console.log(state)
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

  const updateConfig = (updates: Partial<CsvConfig>) => {
    setConfig([{ ...state, ...updates }])
  };

  const addNullValue = () => {
    updateConfig({ nullValues: [...state?.nullValues || [], ""] });
  };

  const removeNullValue = (index: number) => {
    updateConfig({ nullValues: state?.nullValues.filter((_, i) => i !== index) });
  };

  const updateNullValue = (index: number, value: string) => {
    const updated = [...state?.nullValues || []];
    updated[index] = value;
    updateConfig({ nullValues: updated });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">CSV Configuration</Label>
      </div>

      <div>
        <Label>File Path</Label>
        <Input
          value={state.filePath}
          onChange={(e) => updateConfig({ filePath: e.target.value })}
          placeholder="_test/mock/database/Autorizados.csv"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Encoding</Label>
        <Input
          value={state.encoding}
          onChange={(e) => updateConfig({ encoding: e.target.value })}
          placeholder="utf-8"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Type</Label>
        <Input
          value={state.type}
          onChange={(e) => updateConfig({ type: e.target.value })}
          placeholder="csv"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Chunk Size</Label>
        <Input
          type="number"
          value={state.chunkSize}
          onChange={(e) => updateConfig({ chunkSize: parseInt(e.target.value) || 200 })}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Error Policy</Label>
        <Input
          value={state.errorPolicy}
          onChange={(e) => updateConfig({ errorPolicy: e.target.value })}
          placeholder="skip"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Output Variable</Label>
        <Input
          value={state.outputVar || ""}
          onChange={(e) => updateConfig({ outputVar: e.target.value })}
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
        {state.nullValues?.map((value, index) => (
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
            value={state?.parser?.escape}
            onChange={(e) => updateConfig({ parser: { ...state.parser, escape: e.target.value } })}
            placeholder="'"
            className="mt-1"
          />
        </div>

        <div>
          <Label className="text-xs">Separator</Label>
          <Input
            value={state?.parser?.separator}
            onChange={(e) => updateConfig({ parser: { ...state.parser, separator: e.target.value } })}
            placeholder=";"
            className="mt-1"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="strict"
            checked={state?.parser?.strict}
            onCheckedChange={(checked) => updateConfig({ parser: { ...state.parser, strict: checked === true } })}
          />
          <Label htmlFor="strict" className="text-xs cursor-pointer">
            Strict Mode
          </Label>
        </div>
      </Card>
    </div>
  );
};
