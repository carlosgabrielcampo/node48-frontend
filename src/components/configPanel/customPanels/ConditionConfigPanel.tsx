import { ConfigPanelProps, ConditionBlock, ConditionRule } from "@/types/configPanels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { SidebarDropdown } from "../../layout/dropdown";
import { SidebarInput } from "@/components/layout/input";
import { ApiConfig } from "../../../types/configPanels"

export const ConditionConfigPanel = ({ stateConfig, setConfig }: ConfigPanelProps) => {
  
  const updateConfig = (updates: Partial<ApiConfig>) => {
    setConfig([{ ...stateConfig, ...updates }]);
  };

  const addCondition = () => {
    const newCondition: ConditionBlock = {
      condition: [{ field: "", type: "regex", validator: "" }],
      nextStepId: "",
    };
    updateConfig([...stateConfig, newCondition]);
  };

  const removeCondition = (index: number) => {
    setConfig(stateConfig.filter((_, i) => i !== index));
  };

  const addRule = (conditionIndex: number) => {
    const updated = [...stateConfig];
    updated[conditionIndex].condition.push({ field: "", type: "regex", validator: "" });
    setConfig(updated);
  };

  const removeRule = (conditionIndex: number, ruleIndex: number) => {
    const updated = [...stateConfig];
    updated[conditionIndex].condition = updated[conditionIndex].condition.filter((_, i) => i !== ruleIndex);
    setConfig(updated);
  };

  const updateRule = (conditionIndex: number, ruleIndex: number, updates: Partial<ConditionRule>) => {
    const updated = [...stateConfig];
    updated[conditionIndex].condition[ruleIndex] = { ...updated[conditionIndex].condition[ruleIndex], ...updates };
    setConfig(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">Conditions</Label>
        <Button onClick={addCondition} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add Condition
        </Button>
      </div>

      {stateConfig.map((condition, condIndex) => (
        <Card key={condIndex} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Condition {condIndex + 1}</Label>
            <Button onClick={() => removeCondition(condIndex)} size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {
            condition.condition.map((rule, ruleIndex) => (
              <div key={ruleIndex} className="space-y-2 pl-4 border-l-2 border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Rule {ruleIndex + 1}</Label>
                  {condition.condition.length > 1 && (
                    <Button onClick={() => removeRule(condIndex, ruleIndex)} size="sm" variant="ghost">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <SidebarInput 
                  label={"Field"} 
                  value={rule.field} 
                  onChange={(e) => updateRule(condIndex, ruleIndex, { field: e.target.value })} 
                  placeholder="{{csvAutorizados.DT_NASC}}" 
                  className="mt-1"
                />
                <SidebarDropdown 
                  itemList={[
                    {value: "regex", displayName: "Regex"},
                    {value: "equals", displayName: "Equals"},
                    {value: "contains", displayName: "Contains"},
                  ]}
                  label={"Type"}
                  onValueChange={(value) => updateRule(condIndex, ruleIndex, { type: value })}
                  value={rule.type}
                />
                <SidebarInput
                  label={"Validator"} 
                  value={rule.validator}
                  onChange={(e) => updateRule(condIndex, ruleIndex, { validator: e.target.value })}
                  placeholder="/10/"
                  className="mt-1"
                />
              </div>
            ))
          }

          <Button onClick={() => addRule(condIndex)} size="sm" variant="outline" className="w-full">
            <Plus className="h-3 w-3 mr-1" />
            Add Rule
          </Button>
        </Card>
      ))}

      {stateConfig.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-8">
          No conditions defined. Click "Add Condition" to create one.
        </div>
      )}
    </div>
  );
};
