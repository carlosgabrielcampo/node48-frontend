import { WorkflowNode, ConditionBlock, ConditionRule } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

interface ConditionConfigPanelProps {
  node: WorkflowNode;
  onUpdate: (updates: Partial<WorkflowNode>) => void;
}

export const ConditionConfigPanel = ({ node, onUpdate }: ConditionConfigPanelProps) => {
  const conditions = node.Conditions || [];

  const addCondition = () => {
    const newCondition: ConditionBlock = {
      condition: [{ field: "", type: "regex", validator: "" }],
      nextStepId: "",
    };
    onUpdate({ Conditions: [...conditions, newCondition] });
  };

  const removeCondition = (index: number) => {
    onUpdate({ Conditions: conditions.filter((_, i) => i !== index) });
  };

  const updateCondition = (index: number, updates: Partial<ConditionBlock>) => {
    const updated = [...conditions];
    updated[index] = { ...updated[index], ...updates };
    onUpdate({ Conditions: updated });
  };

  const addRule = (conditionIndex: number) => {
    const updated = [...conditions];
    updated[conditionIndex].condition.push({ field: "", type: "regex", validator: "" });
    onUpdate({ Conditions: updated });
  };

  const removeRule = (conditionIndex: number, ruleIndex: number) => {
    const updated = [...conditions];
    updated[conditionIndex].condition = updated[conditionIndex].condition.filter((_, i) => i !== ruleIndex);
    onUpdate({ Conditions: updated });
  };

  const updateRule = (conditionIndex: number, ruleIndex: number, updates: Partial<ConditionRule>) => {
    const updated = [...conditions];
    updated[conditionIndex].condition[ruleIndex] = { ...updated[conditionIndex].condition[ruleIndex], ...updates };
    onUpdate({ Conditions: updated });
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

              <div>
                <Label className="text-xs">Type</Label>
                <Select
                  value={rule.type}
                  onValueChange={(value) => updateRule(condIndex, ruleIndex, { type: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="regex">Regex</SelectItem>
                    <SelectItem value="equals">Equals</SelectItem>
                    <SelectItem value="contains">Contains</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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

          <div>
            <Label className="text-xs">Next Step ID</Label>
            <Input
              value={condition.nextStepId}
              onChange={(e) => updateCondition(condIndex, { nextStepId: e.target.value })}
              placeholder="Node ID"
              className="mt-1"
            />
          </div>
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
