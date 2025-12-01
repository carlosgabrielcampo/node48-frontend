import { ConditionConfigPanelProps, ConditionBlock, ConditionRule } from "@/types/configPanels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Dropdown } from "../layout/dropdown";



export const ConditionConfigPanel = ({ node, onUpdate }: ConditionConfigPanelProps) => {
  // Handle config array format
  const conditions = (node.parameters as ConditionBlock[]) || [];

  const updateConditions = (newConditions: ConditionBlock[]) => {
    onUpdate({ parameters: newConditions });
  };

  const addCondition = () => {
    const newCondition: ConditionBlock = {
      condition: [{ field: "", type: "regex", validator: "" }],
      nextStepId: "",
    };
    updateConditions([...conditions, newCondition]);
  };

  const removeCondition = (index: number) => {
    updateConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, updates: Partial<ConditionBlock>) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], ...updates };
    updateConditions(updated);
  };

  const addRule = (conditionIndex: number) => {
    const updated = [...conditions];
    updated[conditionIndex].condition.push({ field: "", type: "regex", validator: "" });
    updateConditions(updated);
  };

  const removeRule = (conditionIndex: number, ruleIndex: number) => {
    const updated = [...conditions];
    updated[conditionIndex].condition = updated[conditionIndex].condition.filter((_, i) => i !== ruleIndex);
    updateConditions(updated);
  };

  const updateRule = (conditionIndex: number, ruleIndex: number, updates: Partial<ConditionRule>) => {
    const updated = [...conditions];
    updated[conditionIndex].condition[ruleIndex] = { ...updated[conditionIndex].condition[ruleIndex], ...updates };
    updateConditions(updated);
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

      {conditions.map((condition, condIndex) => (
        <Card key={condIndex} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Condition {condIndex + 1}</Label>
            <Button onClick={() => removeCondition(condIndex)} size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {condition.condition.map((rule, ruleIndex) => (
            <div key={ruleIndex} className="space-y-2 pl-4 border-l-2 border-border">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Rule {ruleIndex + 1}</Label>
                {condition.condition.length > 1 && (
                  <Button onClick={() => removeRule(condIndex, ruleIndex)} size="sm" variant="ghost">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div>
                <Label className="text-xs">Field</Label>
                <Input
                  value={rule.field}
                  onChange={(e) => updateRule(condIndex, ruleIndex, { field: e.target.value })}
                  placeholder="{{csvAutorizados.DT_NASC}}"
                  className="mt-1"
                />
              </div>

              <Dropdown itemList={[
                {value: "regex", displayName: "Regex"},
                {value: "equals", displayName: "Equals"},
                {value: "contains", displayName: "Contains"},
              ]} 
                label={"Type"}
                onValueChange={(value) => updateRule(condIndex, ruleIndex, { type: value })}
                value={rule.type}
              />

              <div>
                <Label className="text-xs">Validator</Label>
                <Input
                  value={rule.validator}
                  onChange={(e) => updateRule(condIndex, ruleIndex, { validator: e.target.value })}
                  placeholder="/10/"
                  className="mt-1"
                />
              </div>
            </div>
          ))}

          <Button onClick={() => addRule(condIndex)} size="sm" variant="outline" className="w-full">
            <Plus className="h-3 w-3 mr-1" />
            Add Rule
          </Button>
        </Card>
      ))}

      {conditions.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-8">
          No conditions defined. Click "Add Condition" to create one.
        </div>
      )}
    </div>
  );
};
