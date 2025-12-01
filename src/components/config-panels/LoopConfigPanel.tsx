import { LoopConfigEntry, LoopFormatField, LoopConfigPanelProps } from "@/types/configPanels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, PenBox } from "lucide-react";
import { useState } from "react";
import { Dropdown } from "../layout/dropdown";

export const LoopConfigPanel = ({ node, onUpdate }: LoopConfigPanelProps) => {
  const newEntry: LoopConfigEntry = {
    sourceVar: "",
    outputVar: "",
    type: "format",
    nextStepId: "",
    fields: [],
  };
  const parameters = (node.parameters as LoopConfigEntry[]) || [];
  const [stateConfig, setConfig] = useState(node.parameters as LoopConfigEntry[]);
  const saveConfig = () => { onUpdate({parameters: stateConfig}) }
  
  const addConfigEntry = () => { setConfig([...parameters, newEntry]); };

  const removeConfigEntry = (index: number) => { setConfig(parameters.filter((_, i) => i !== index)); };

  const updateConfigEntry = (index: number, updates: Partial<LoopConfigEntry>) => {
    const updated = [...parameters];
    updated[index] = { ...updated[index], ...updates };
    setConfig(updated);
  };

  const addField = (configIndex: number) => {
    const updated = [...parameters];
    const fields = updated[configIndex].fields || [];
    updated[configIndex].fields = [...fields, { field: "", type: "convert", convertionType: "" }];
    setConfig(updated);
  };

  const removeField = (configIndex: number, fieldIndex: number) => {
    const updated = [...parameters];
    updated[configIndex].fields = updated[configIndex].fields?.filter((_, i) => i !== fieldIndex);
    setConfig(updated);
  };

  const updateField = (configIndex: number, fieldIndex: number, updates: Partial<LoopFormatField>) => {
    const updated = [...parameters];
    const fields = updated[configIndex].fields || [];
    fields[fieldIndex] = { ...fields[fieldIndex], ...updates };
    updated[configIndex].fields = fields;
    setConfig(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Loop Configuration</Label>
        <Button onClick={addConfigEntry} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add Config
        </Button>
      </div>

      {stateConfig.map((entry, index) => (
        <Card key={index} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Label className="font-medium">Config {index + 1}</Label>
              <PenBox className="h-4 w-4 text-muted-foreground"/>
            </div>
            <Button onClick={() => removeConfigEntry(index)} size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <Label className="text-xs">Source Variable</Label>
            <Input
              value={entry.sourceVar}
              onChange={(e) => updateConfigEntry(index, { sourceVar: e.target.value })}
              placeholder="{{Autorizados}}"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Output Variable</Label>
            <Input
              value={entry.outputVar}
              onChange={(e) => updateConfigEntry(index, { outputVar: e.target.value })}
              placeholder="csvAutorizados"
              className="mt-1"
            />
          </div>
          
          <Dropdown itemList={[
            {value: "format", displayName: "Format"},
            {value: "create", displayName: "Create"},
          ]} 
            label={"Type"}
            onValueChange={(value: "format" | "create") => updateConfigEntry(index, { type: value })}
            value={entry.type}
          />

          {entry.type === "format" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Fields</Label>
                <Button onClick={() => addField(index)} size="sm" variant="outline">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Field
                </Button>
              </div>
              {entry.fields?.map((field, fieldIndex) => (
                <div key={fieldIndex} className="pl-4 border-l-2 border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Field {fieldIndex + 1}</Label>
                    <Button onClick={() => removeField(index, fieldIndex)} size="sm" variant="ghost">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <Input
                    value={field.field}
                    onChange={(e) => updateField(index, fieldIndex, { field: e.target.value })}
                    placeholder="{{Autorizados.DT_NASC}}"
                  />
                  <Input
                    value={field.type}
                    onChange={(e) => updateField(index, fieldIndex, { type: e.target.value })}
                    placeholder="convert"
                  />
                  <Input
                    value={field.convertionType}
                    onChange={(e) => updateField(index, fieldIndex, { convertionType: e.target.value })}
                    placeholder="brDateFormatToDate"
                  />
                </div>
              ))}
            </div>
          )}

          {entry.type === "create" && (
            <>
              <div>
                <Label className="text-xs">Limit</Label>
                <Input
                  type="number"
                  value={entry.limit || ""}
                  onChange={(e) => updateConfigEntry(index, { limit: parseInt(e.target.value) || undefined })}
                  placeholder="10"
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-xs">Offset</Label>
                <Input
                  type="number"
                  value={entry.offset || ""}
                  onChange={(e) => updateConfigEntry(index, { offset: parseInt(e.target.value) || undefined })}
                  placeholder="100"
                  className="mt-1"
                />
              </div>
            </>
          )}
        </Card>
      ))}
      <Button size="sm" className="mt-1 w-full" onClick={saveConfig}>Save</Button>
      {parameters.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-8">
          No configuration entries. Click "Add Config" to create one.
        </div>
      )}
    </div>
  );
};
