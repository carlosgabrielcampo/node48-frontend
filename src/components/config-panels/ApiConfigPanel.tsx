import { ApiConfigPanelProps, ApiConfig } from "@/types/configPanels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Dropdown } from "../layout/dropdown";

export const ApiConfigPanel = ({ node, onUpdate }: ApiConfigPanelProps) => {
  const parameters = (node.parameters as ApiConfig) || {
    baseUrl: "",
    endpoint: "",
    method: "GET",
    headers: {},
    body: {},
    reponseFormat: "json",
  };

  const updateConfig = (updates: Partial<ApiConfig>) => {
    onUpdate({ parameters: { ...parameters, ...updates } });
  };

  const addHeader = () => {
    updateConfig({ headers: { ...parameters.headers, "": "" } });
  };

  const removeHeader = (key: string) => {
    const { [key]: _, ...rest } = parameters.headers;
    updateConfig({ headers: rest });
  };

  const updateHeader = (oldKey: string, newKey: string, value: string) => {
    const { [oldKey]: _, ...rest } = parameters.headers;
    updateConfig({ headers: { ...rest, [newKey]: value } });
  };

  const addBodyField = () => {
    updateConfig({ body: { ...parameters.body, "": "" } });
  };

  const removeBodyField = (key: string) => {
    const { [key]: _, ...rest } = parameters.body;
    updateConfig({ body: rest });
  };

  const updateBodyField = (oldKey: string, newKey: string, value: string) => {
    const { [oldKey]: _, ...rest } = parameters.body;
    updateConfig({ body: { ...rest, [newKey]: value } });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Base URL</Label>
        <Input
          value={parameters.baseUrl}
          onChange={(e) => updateConfig({ baseUrl: e.target.value })}
          placeholder="http://localhost:3009"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Endpoint</Label>
        <Input
          value={parameters.endpoint}
          onChange={(e) => updateConfig({ endpoint: e.target.value })}
          placeholder="/api/webhook/status"
          className="mt-1"
        />
      </div>
      <Dropdown itemList={[
        {value: "GET", displayName: "GET"},
        {value: "POST", displayName: "POST"},
        {value: "PUT", displayName: "PUT"},
        {value: "DELETE", displayName: "DELETE"},
        {value: "PATCH", displayName: "PATCH"},
      ]} 
        label={"Method"}
        onValueChange={(value) => updateConfig({ method: value })}
        value={parameters.method}
      />

      <Dropdown itemList={[
        {value: "json", displayName: "json"},
        {value: "text", displayName: "text"},
      ]} 
        label={"Response Format"}
        onValueChange={(value) => updateConfig({ reponseFormat: value })}
        value={parameters.reponseFormat}
      />

      <div>
        <Label>Timeout (ms)</Label>
        <Input
          type="number"
          value={node.list?.timeoutMs || 15000}
          onChange={(e) => onUpdate({ list: { ...node.list, timeoutMs: parseInt(e.target.value) || 15000, keys: node.list?.keys || [] } })}
          className="mt-1"
        />
      </div>

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Headers</Label>
          <Button onClick={addHeader} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {Object.entries(parameters.headers).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <Input
              value={key}
              onChange={(e) => updateHeader(key, e.target.value, value)}
              placeholder="Key"
              className="flex-1"
            />
            <Input
              value={value}
              onChange={(e) => updateHeader(key, key, e.target.value)}
              placeholder="Value"
              className="flex-1"
            />
            <Button onClick={() => removeHeader(key)} size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Body</Label>
          <Button onClick={addBodyField} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {Object.entries(parameters.body).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <Input
              value={key}
              onChange={(e) => updateBodyField(key, e.target.value, value)}
              placeholder="Key"
              className="flex-1"
            />
            <Input
              value={value}
              onChange={(e) => updateBodyField(key, key, e.target.value)}
              placeholder="Value"
              className="flex-1"
            />
            <Button onClick={() => removeBodyField(key)} size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </Card>
    </div>
  );
};
