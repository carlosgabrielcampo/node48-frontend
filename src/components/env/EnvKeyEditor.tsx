import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Trash2, Plus } from "lucide-react";
import { EnvValues } from "@/types/env";
import { Label } from "@/components/ui/label";

interface EnvKeyEditorProps {
  values: EnvValues;
  onChange: (values: EnvValues) => void;
  readOnly?: boolean;
}

export const EnvKeyEditor = ({ values, onChange, readOnly = false }: EnvKeyEditorProps) => {
  const [maskedKeys, setMaskedKeys] = useState<Set<string>>(new Set(Object.keys(values)));
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const toggleMask = (key: string) => {
    setMaskedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const updateKey = (oldKey: string, newKey: string) => {
    if (readOnly) return;
    const { [oldKey]: value, ...rest } = values;
    onChange({ ...rest, [newKey]: value });
  };

  const updateValue = (key: string, newValue: string) => {
    if (readOnly) return;
    onChange({ ...values, [key]: newValue });
  };

  const deleteKey = (key: string) => {
    if (readOnly) return;
    const { [key]: _, ...rest } = values;
    onChange(rest);
  };

  const addKey = () => {
    if (readOnly || !newKey.trim()) return;
    onChange({ ...values, [newKey.trim()]: newValue });
    setNewKey("");
    setNewValue("");
    setMaskedKeys((prev) => new Set([...prev, newKey.trim()]));
  };

  const entries = Object.entries(values);

  return (
    <div className="space-y-3">
      {entries.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No environment variables defined
        </p>
      )}
      
      {entries.map(([key, value]) => (
        <div key={key} className="flex items-center gap-2">
          <Input
            value={key}
            onChange={(e) => updateKey(key, e.target.value)}
            placeholder="KEY"
            className="flex-1 font-mono text-sm"
            readOnly={readOnly}
          />
          <div className="relative flex-1">
            <Input
              type={maskedKeys.has(key) ? "password" : "text"}
              value={value}
              onChange={(e) => updateValue(key, e.target.value)}
              placeholder="value"
              className="font-mono text-sm pr-10"
              readOnly={readOnly}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => toggleMask(key)}
              aria-label={maskedKeys.has(key) ? "Show value" : "Hide value"}
            >
              {maskedKeys.has(key) ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </Button>
          </div>
          {!readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => deleteKey(key)}
              aria-label="Delete variable"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      ))}

      {!readOnly && (
        <div className="border-t pt-3 mt-3">
          <Label className="text-xs text-muted-foreground mb-2 block">Add new variable</Label>
          <div className="flex items-center gap-2">
            <Input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value.toUpperCase())}
              placeholder="NEW_KEY"
              className="flex-1 font-mono text-sm"
              onKeyDown={(e) => e.key === "Enter" && addKey()}
            />
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="value"
              className="flex-1 font-mono text-sm"
              onKeyDown={(e) => e.key === "Enter" && addKey()}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addKey}
              disabled={!newKey.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
