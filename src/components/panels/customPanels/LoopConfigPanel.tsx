import { LoopConfigEntry, LoopFormatField, LoopConfigPanelProps } from "@/types/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { LabeledDropdown } from "../../layout/dropdown";
import { LabeledInput } from "@/components/layout/input";
import { LabeledCard } from "@/components/layout/card";

export const LoopConfigPanel = ({ state, setState }: LoopConfigPanelProps) => {
  const newEntry: LoopConfigEntry = {
    sourceVar: "",
    outputVar: "",
    type: "format",
    nextStepId: "",
    fields: [],
  };

  const addConfigEntry = () => { 
    setState([...state, newEntry]); 
  };

  const removeConfigEntry = (index: number) => { 
    setState(state.filter((_, i) => i !== index)); 
  };

  const updateConfigEntry = (index: number, updates: Partial<LoopConfigEntry>) => {
    const updated = [...state];
    updated[index] = { ...updated[index], ...updates };
    setState(updated);
  };

  const addField = (configIndex: number) => {
    const updated = [...state];
    const fields = updated[configIndex].fields || [];
    updated[configIndex].fields = [...fields, { field: "", type: "convert", convertionType: "" }];
    setState(updated);
  };

  const removeField = (configIndex: number, fieldIndex: number) => {
    const updated = [...state];
    updated[configIndex].fields = updated[configIndex].fields?.filter((_, i) => i !== fieldIndex);
    setState(updated);
  };

  const updateField = (configIndex: number, fieldIndex: number, updates: Partial<LoopFormatField>) => {
    const updated = [...state];
    const fields = updated[configIndex].fields || [];
    fields[fieldIndex] = { ...fields[fieldIndex], ...updates };
    updated[configIndex].fields = fields;
    setState(updated);
  };

  return (
    <LabeledCard
      label={"Loop Configuration"}
      headerChildren={
        <Button onClick={addConfigEntry} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add Config
        </Button>
      }
      cardChildren={
        state.length ? 
          state.map((entry, index) => (
            <Card key={index} className="p-3 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label className="font-medium">Config {index + 1}</Label>
                </div>
                <Button onClick={() => removeConfigEntry(index)} size="sm" variant="ghost">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <LabeledInput
                  label={"Source Variable"}
                  className={"mt-1"}
                  onChange={(e) => updateConfigEntry(index, { sourceVar: e.target.value })}
                  placeholder="{{Autorizados}}"
                  value={entry.sourceVar}
              />
              <LabeledInput 
                label={"Output Variable"}
                className={"mt-1"}
                onChange={(e) => updateConfigEntry(index, { outputVar: e.target.value })}
                placeholder={"csvAutorizados"}
                value={entry.outputVar}
              />
              <LabeledDropdown itemsList={[
                {itemProperties: {value: "format"}, itemDisplay: "Format"},
                {itemProperties: {value: "create"}, itemDisplay: "Create"},
                {itemProperties: {value: "raw"}, itemDisplay: "Raw"},
              ]} 
                label={"Type"}
                onSelect={({value}) => updateConfigEntry(index, { type: value })}
                header={entry.type}
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
          ))
        : (
          <div className="text-sm text-muted-foreground text-center py-8">
            No configuration entries. Click "Add Config" to create one.
          </div>
        )
      }
    />
  );
};
