import { ConfigPanelProps, ApiConfig } from "@/types/configPanels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { SidebarDropdown } from "../../layout/dropdown";
import { SidebarInput } from "@/components/layout/input";
import { Textarea } from "@/components/ui/textarea";
import { CodeTextarea } from "@/components/layout/textarea";
import { useState } from "react";

export const ApiConfigPanel = ({ stateConfig, setConfig }: ConfigPanelProps) => {
  const state = stateConfig[0]

  const [raw, setRaw] = useState(JSON.stringify(state.body, null, 2));

  console.log(state)
  // Handle parameters as array (JSON format)
  
  const updateConfig = (updates: Partial<ApiConfig>) => {
    setConfig([{ ...state, ...updates }]);
  };

  const addParams = () => {
    updateConfig({ params: { ...state.params, "": "" } });
  };

  const removeParams = (key: string) => {
    const { [key]: _, ...rest } = state.params;
    updateConfig({ params: rest });
  };

  const updateParams = (oldKey: string, newKey: string, value: string) => {
    const { [oldKey]: _, ...rest } = state.params;
    updateConfig({ params: { ...rest, [newKey]: value } });
  };

  const addHeader = () => {
    updateConfig({ headers: { ...state.headers, "": "" } });
  };

  const removeHeader = (key: string) => {
    const { [key]: _, ...rest } = state.headers;
    updateConfig({ headers: rest });
  };

  const updateHeader = (oldKey: string, newKey: string, value: string) => {
    const { [oldKey]: _, ...rest } = state.headers;
    updateConfig({ headers: { ...rest, [newKey]: value } });
  };

  const addBodyField = () => {
    updateConfig({ body: { ...state.body, "": "" } });
  };

  const removeBodyField = (key: string) => {
    const { [key]: _, ...rest } = state.body;
    updateConfig({ body: rest });
  };

  const updateBodyField = (oldKey: string, newKey: string, value: string) => {
    const { [oldKey]: _, ...rest } = state.body;
    updateConfig({ body: { ...rest, [newKey]: value } });
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  const text = e.target.value;
  setRaw(text);
  try {
    const parsed = JSON.parse(text);
    updateConfig({ body: parsed });
  } catch (_) {
    // ignore until the JSON becomes valid
  }
};

  return (
    <div className="space-y-4">
      <SidebarInput 
        label={"Base URL"} 
        value={state.baseUrl}
        placeholder="http://localhost:3009"
        onChange={(e) => updateConfig({ baseUrl: e.target.value })}
        className="mt-1"
      />
      <SidebarInput 
        label={"Endpoint"} 
        value={state.endpoint}
        placeholder="/api/webhook/status"
        onChange={(e) => updateConfig({ endpoint: e.target.value })}
        className="mt-1"
      />
      <SidebarInput 
        label={"Timeout (ms)"} 
        type="number"
        value={state.timeout}
        onChange={(e) => updateConfig({ timeout: e.target.value })}
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
        value={state.method}
      />
      <SidebarDropdown
        itemList={[
          {value: "json", displayName: "json"},
          {value: "text", displayName: "text"},
        ]} 
        label={"Response Format"}
        onValueChange={(value) => updateConfig({ reponseFormat: value })}
        value={state.reponseFormat}
      />
      <SidebarInput 
        label={"Output Variable"} 
        value={state.outputVar || ""} 
        onChange={(e) => updateConfig({ outputVar: e.target.value })}
        placeholder={"apiResponse"}
        className={"mt-1"}
      />

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Params</Label>
          <Button onClick={addParams} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {
          state?.params && Object.entries(state?.params)?.map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <Input
                value={key}
                onChange={(e) => updateParams(key, e.target.value, value)}
                placeholder="Key"
                className="flex-1"
              />
              <Input
                value={value}
                onChange={(e) => updateParams(key, key, e.target.value)}
                placeholder="Value"
                className="flex-1"
              />
              <Button onClick={() => removeParams(key)} size="sm" variant="ghost">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        }
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Headers</Label>
          <Button onClick={addHeader} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {
          state?.headers && Object.entries(state?.headers)?.map(([key, value]) => (
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
          ))
        }
      </Card>

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Body</Label>
          <Button onClick={addBodyField} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {
        state?.body && !state.bodyType && 
          <div className="flex gap-2">
            <CodeTextarea
              value={raw}
              onChange={handleBodyChange}
              placeholder="Key"
              className="flex-1 min-h-52"
            />
            <Button onClick={() => removeBodyField(key)} size="sm" variant="ghost">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        }
        {state?.body && state.bodyType === "x-www-form-urlencoded" && Object.entries(state?.body).map(([key, value]) => (
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
