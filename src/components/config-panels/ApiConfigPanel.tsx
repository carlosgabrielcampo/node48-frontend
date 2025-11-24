import { ApiConfigPanelProps, ApiConfig } from "@/types/config-panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export const ApiConfigPanel = ({ node, onUpdate }: ApiConfigPanelProps) => {
  const config = (node.config as ApiConfig) || {
    baseUrl: "",
    endpoint: "",
    method: "GET",
    headers: {},
    body: {},
    reponseFormat: "json",
  };

  const updateConfig = (updates: Partial<ApiConfig>) => {
    onUpdate({ config: { ...config, ...updates } });
  };

  const addHeader = () => {
    updateConfig({ headers: { ...config.headers, "": "" } });
  };

  const removeHeader = (key: string) => {
    const { [key]: _, ...rest } = config.headers;
    updateConfig({ headers: rest });
  };

  const updateHeader = (oldKey: string, newKey: string, value: string) => {
    const { [oldKey]: _, ...rest } = config.headers;
    updateConfig({ headers: { ...rest, [newKey]: value } });
  };

  const addBodyField = () => {
    updateConfig({ body: { ...config.body, "": "" } });
  };

  const removeBodyField = (key: string) => {
    const { [key]: _, ...rest } = config.body;
    updateConfig({ body: rest });
  };

  const updateBodyField = (oldKey: string, newKey: string, value: string) => {
    const { [oldKey]: _, ...rest } = config.body;
    updateConfig({ body: { ...rest, [newKey]: value } });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Base URL</Label>
        <Input
          value={config.baseUrl}
          onChange={(e) => updateConfig({ baseUrl: e.target.value })}
          placeholder="http://localhost:3009"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Endpoint</Label>
        <Input
          value={config.endpoint}
          onChange={(e) => updateConfig({ endpoint: e.target.value })}
          placeholder="/api/webhook/status"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Method</Label>
        <Select value={config.method} onValueChange={(value) => updateConfig({ method: value })}>
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Response Format</Label>
        <Input
          value={config.reponseFormat}
          onChange={(e) => updateConfig({ reponseFormat: e.target.value })}
          className="mt-1"
        />
      </div>

      <div>
        <Label>Output Variable</Label>
        <Input
          value={node.outputVar || ""}
          onChange={(e) => onUpdate({ outputVar: e.target.value })}
          placeholder="apiAutorizados"
          className="mt-1"
        />
      </div>

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
        {Object.entries(config.headers).map(([key, value]) => (
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
        {Object.entries(config.body).map(([key, value]) => (
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
