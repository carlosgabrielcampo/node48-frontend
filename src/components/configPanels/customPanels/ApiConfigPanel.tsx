import { ApiConfigPanelProps, ApiConfig } from "@/types/configPanels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Dropdown } from "../../layout/dropdown";
import { CodeTextarea } from "@/components/layout/textarea";
import { useState } from "react";
import { LabeledInput } from "@/components/layout/input";

export const ApiConfigPanel = ({ state, setState }: ApiConfigPanelProps) => {
  console.log({ApiConfigPanel: state, setState})
  // Handle parameters as array (JSON format)
  const paramArray = Array.isArray(state) ? state[0] as ApiConfig[] : [];
  const [raw, setRaw] = useState(() => JSON.stringify(paramArray.body, null, 2));

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRaw(text);
  
    try {
      const parsed = JSON.parse(text);
      updateConfig({ body: parsed });
    } catch (_) {
      // ignore until the JSON becomes valid
    }
  };
  const parameters = paramArray || {
    baseUrl: "",
    endpoint: "",
    method: "GET",
    headers: {},
    body: {},
    params: {},
    reponseFormat: "json",
    outputVar: "",
    nextStepId: "",
    errorStepId: ""
  };

  const updateConfig = (updates: Partial<ApiConfig>) => {
    setState({ parameters: [{ ...parameters, ...updates }] });
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

    const addParams = () => {
    updateConfig({ params: { ...parameters.params, "": "" } });
  };

  const removeParams = (key: string) => {
    const { [key]: _, ...rest } = parameters.params;
    updateConfig({ params: rest });
  };

  const updateParams = (oldKey: string, newKey: string, value: string) => {
    const { [oldKey]: _, ...rest } = parameters.params;
    updateConfig({ params: { ...rest, [newKey]: value } });
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
      <LabeledInput 
        label={"Endpoint"}
        value={state.list?.timeoutMs || 15000}
        placeholder="/api/webhook/status"
        onChange={(e) => updateConfig({ endpoint: e.target.value })}
        className="mt-1"
      />

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
      <LabeledInput 
        label={"Timeout (ms)"} 
        value={state.list?.timeoutMs || 15000}
        onChange={(e) => updateConfig({ list: { ...state.list, timeoutMs: parseInt(e.target.value) || 15000, keys: state.list?.keys || [] } })}
        className="mt-1"
        type="number" 
      />

      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Params</Label>
          <Button onClick={addParams} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {parameters?.params && Object.entries(parameters?.params).map(([key, value]) => (
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
        ))}
      </Card>


      <Card className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Label className="font-semibold">Headers</Label>
          <Button onClick={addHeader} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
        {Object.entries(parameters?.headers).map(([key, value]) => (
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
        </div>
        <CodeTextarea value={raw} onChange={handleChange}/>
      </Card>
    </div>
  );
};
