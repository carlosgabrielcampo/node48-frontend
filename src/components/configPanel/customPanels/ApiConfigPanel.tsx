import { ConfigPanelProps, ApiConfig } from "@/types/configPanels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { SidebarDropdown } from "../../layout/dropdown";
import { SidebarInput } from "@/components/layout/input";

export const ApiConfigPanel = ({ stateConfig, setConfig }: ConfigPanelProps) => {
  // Handle parameters as array (JSON format)
  
  const updateConfig = (updates: Partial<ApiConfig>) => {
    setConfig({ parameters: [{ ...stateConfig, ...updates }] });
  };

  const addHeader = () => {
    setConfig({ headers: { ...stateConfig.headers, "": "" } });
  };

  const removeHeader = (key: string) => {
    const { [key]: _, ...rest } = stateConfig.headers;
    setConfig({ headers: rest });
  };

  const updateHeader = (oldKey: string, newKey: string, value: string) => {
    const { [oldKey]: _, ...rest } = stateConfig.headers;
    setConfig({ headers: { ...rest, [newKey]: value } });
  };

  const addBodyField = () => {
    setConfig({ body: { ...stateConfig.body, "": "" } });
  };

  const removeBodyField = (key: string) => {
    const { [key]: _, ...rest } = stateConfig.body;
    setConfig({ body: rest });
  };

  const updateBodyField = (oldKey: string, newKey: string, value: string) => {
    const { [oldKey]: _, ...rest } = stateConfig.body;
    setConfig({ body: { ...rest, [newKey]: value } });
  };

  return (
    <div className="space-y-4">
      <SidebarInput 
        label={"Base URL"} 
        value={stateConfig.baseUrl}
        placeholder="http://localhost:3009"
        onChange={(e) => updateConfig({ baseUrl: e.target.value })}
        className="mt-1"
      />
      <SidebarInput 
        label={"Endpoint"} 
        value={stateConfig.endpoint}
        placeholder="/api/webhook/status"
        onChange={(e) => updateConfig({ endpoint: e.target.value })}
        className="mt-1"
      />
      <SidebarInput 
        label={"Timeout (ms)"} 
        type="number"
        value={stateConfig.endpoint}
        onChange={(e) => updateConfig({ endpoint: e.target.value })}
        className="mt-1"
      />
      <SidebarDropdown 
        label={"Method"}
        onValueChange={(value) => updateConfig({ method: value })}
        itemList={[
          {value: "GET", displayName: "GET"},
          {value: "POST", displayName: "POST"},
          {value: "PUT", displayName: "PUT"},
          {value: "DELETE", displayName: "DELETE"},
          {value: "PATCH", displayName: "PATCH"},
        ]}
        value={stateConfig.method}
      />
      <SidebarDropdown
        itemList={[
          {value: "json", displayName: "json"},
          {value: "text", displayName: "text"},
        ]} 
        label={"Response Format"}
        onValueChange={(value) => updateConfig({ reponseFormat: value })}
        value={stateConfig.reponseFormat}
      />
      <SidebarInput 
        label={"Output Variable"} 
        value={stateConfig.outputVar || ""} 
        onChange={(e) => updateConfig({ outputVar: e.target.value })}
        placeholder={"apiResponse"}
        className={"mt-1"}
      />
      <SidebarInput 
        label={"Timeout (ms)"} 
        type="number"
        value={stateConfig.list?.timeoutMs}
        placeholder="15000"
        onChange={(e) => updateConfig({ list: { ...stateConfig.list, timeoutMs: parseInt(e.target.value) || 15000, keys: stateConfig.list?.keys || [] } })}
        className="mt-1"
      />

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Headers</Label>
          <Button onClick={addHeader} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {stateConfig?.headers && Object.entries(stateConfig?.headers)?.map(([key, value]) => (
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
        {stateConfig?.body && Object.entries(stateConfig?.body).map(([key, value]) => (
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
