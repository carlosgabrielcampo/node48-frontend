import { ApiConfigPanelProps, ApiConfig } from "@/types/configPanels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { LabeledDropdown } from "../../layout/dropdown";
import { CodeTextarea } from "@/components/layout/textArea";
import { useState, useEffect } from "react";
import { LabeledInput } from "@/components/layout/input";
import { LabeledCard } from "@/components/layout/card";

export const ApiConfigPanel = ({ state, setState }: ApiConfigPanelProps) => {
  const defaultConfig: ApiConfig = {
    baseUrl: "",
    endpoint: "",
    method: "GET",
    headers: {},
    body: {},
    bodyType: "none",
    params: {},
    reponseFormat: "json",
    outputVar: "",
  };

  // Ensure we have at least one config
  const configs = state.length > 0 ? state : [defaultConfig];
  const [raw, setRaw] = useState(() => JSON.stringify(configs[0]?.body || {}, null, 2));

  useEffect(() => {
    if (configs[0]?.body) {
      setRaw(JSON.stringify(configs[0].body, null, 2));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRaw(text);
  
    try {
      const parsed = JSON.parse(text);
      updateConfig(0, { body: parsed });
    } catch (_) {
      // ignore until the JSON becomes valid
    }
  };

  const updateConfig = (index: number, updates: Partial<ApiConfig>) => {
    const updated = [...configs];
    updated[index] = { ...updated[index], ...updates };
    setState(updated);
  };

  const addHeader = (index: number) => {
    const updated = [...configs];
    updated[index] = { ...updated[index], headers: { ...updated[index].headers, "": "" } };
    setState(updated);
  };

  const removeHeader = (configIndex: number, key: string) => {
    const updated = [...configs];
    const { [key]: _, ...rest } = updated[configIndex].headers;
    updated[configIndex] = { ...updated[configIndex], headers: rest };
    setState(updated);
  };

  const updateHeader = (configIndex: number, oldKey: string, newKey: string, value: string) => {
    const updated = [...configs];
    const { [oldKey]: _, ...rest } = updated[configIndex].headers;
    updated[configIndex] = { ...updated[configIndex], headers: { ...rest, [newKey]: value } };
    setState(updated);
  };

  const addParams = (index: number) => {
    const updated = [...configs];
    updated[index] = { ...updated[index], params: { ...(updated[index].params || {}), "": "" } };
    setState(updated);
  };

  const removeParams = (configIndex: number, key: string) => {
    const updated = [...configs];
    const params = updated[configIndex].params || {};
    const { [key]: _, ...rest } = params;
    updated[configIndex] = { ...updated[configIndex], params: rest };
    setState(updated);
  };

  const updateParams = (configIndex: number, oldKey: string, newKey: string, value: string) => {
    const updated = [...configs];
    const params = updated[configIndex].params || {};
    const { [oldKey]: _, ...rest } = params;
    updated[configIndex] = { ...updated[configIndex], params: { ...rest, [newKey]: value } };
    setState(updated);
  };

  return (
    <LabeledCard 
      label={"API Configuration"}
      headerChildren={<></>}
      cardChildren={
        configs.map((parameters, index) => (
          <div key={index} className="space-y-4 p-3">
            <LabeledInput 
              label={"Base URL"}
              value={parameters.baseUrl}
              placeholder="http://localhost:3009"
              onChange={(e) => updateConfig(index, { baseUrl: e.target.value })}
              className="mt-1"
            />
            <LabeledInput 
              label={"Endpoint"}
              value={parameters.endpoint}
              placeholder="/api/webhook/status"
              onChange={(e) => updateConfig(index, { endpoint: e.target.value })}
              className="mt-1"
            />
            <LabeledDropdown itemList={[
              {value: "GET", displayName: "GET"},
              {value: "POST", displayName: "POST"},
              {value: "PUT", displayName: "PUT"},
              {value: "PATCH", displayName: "PATCH"},
              {value: "DELETE", displayName: "DELETE"},
            ]} 
              label={"Method"}
              onValueChange={(value) => updateConfig(index, { method: value })}
              value={parameters.method}
            />
            <LabeledDropdown itemList={[
              {value: "json", displayName: "JSON"},
              {value: "text", displayName: "TEXT"},
            ]} 
              label={"Response Format"}
              onValueChange={(value) => updateConfig(index, { reponseFormat: value })}
              value={parameters.reponseFormat}
            />
            <LabeledInput 
              label={"OutputVar"}
              value={parameters.outputVar || ""}
              placeholder="apiAuthorized"
              onChange={(e) => updateConfig(index, { outputVar: e.target.value })}
              className="mt-1"
            />
            <LabeledCard 
              label={"Params"}
              headerChildren={
                <Button onClick={() => addParams(index)} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              }
              cardChildren={
                parameters?.params && Object.entries(parameters.params).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <Input
                      value={key}
                      onChange={(e) => updateParams(index, key, e.target.value, value)}
                      placeholder="Key"
                      className="flex-1"
                    />
                    <Input
                      value={value}
                      onChange={(e) => updateParams(index, key, key, e.target.value)}
                      placeholder="Value"
                      className="flex-1"
                    />
                    <Button onClick={() => removeParams(index, key)} size="sm" variant="ghost">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              }
            />
            <LabeledCard 
              label={"Headers"}
              headerChildren={
                <Button onClick={() => addHeader(index)} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              }
              cardChildren={Object.entries(parameters?.headers || {}).map(([key, value]) => (
                <div key={key} className="flex gap-2">
                  <Input
                    value={key}
                    onChange={(e) => updateHeader(index, key, e.target.value, value)}
                    placeholder="Key"
                    className="flex-1"
                  />
                  <Input
                    value={value}
                    onChange={(e) => updateHeader(index, key, key, e.target.value)}
                    placeholder="Value"
                    className="flex-1"
                  />
                  <Button onClick={() => removeHeader(index, key)} size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            />
            <LabeledCard 
              label={"Body"}
              headerChildren={
                <LabeledDropdown 
                  value={parameters.bodyType || "none"} 
                  className={"w-40"}
                  itemList={[
                    {value: "none", displayName: "none"},
                    {value: "raw", displayName: "raw"},
                    {value: "xxx-url-encoded", displayName: "xxx-url-encoded"},
                    {value: "form-data", displayName: "form-data"},
                  ]}
                  onValueChange={(value: "none" | "raw" | "xxx-url-encoded" | "form-data") => updateConfig(index, { bodyType: value })}
                />
              }
              cardChildren={
                parameters.bodyType === "raw" 
                  ? <CodeTextarea value={raw} onChange={handleChange} className="min-h-[300px]"/> 
                  : parameters.bodyType === "xxx-url-encoded" 
                    ? Object.entries(parameters?.body || {}).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <Input
                          value={key}
                          onChange={(e) => updateHeader(index, key, e.target.value, String(value))}
                          placeholder="Key"
                          className="flex-1"
                        />
                        <Input
                          value={String(value)}
                          onChange={(e) => updateHeader(index, key, key, e.target.value)}
                          placeholder="Value"
                          className="flex-1"
                        />
                        <Button onClick={() => removeHeader(index, key)} size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                    : parameters.bodyType === "form-data" 
                      ? Object.entries(parameters?.body || {}).map(([key, value]) => (
                          <div key={key} className="flex gap-2">
                            <Input
                              value={key}
                              onChange={(e) => updateHeader(index, key, e.target.value, String(value))}
                              placeholder="Key"
                              className="flex-1"
                            />
                            <Input
                              value={String(value)}
                              onChange={(e) => updateHeader(index, key, key, e.target.value)}
                              placeholder="Value"
                              className="flex-1"
                            />
                            <Button onClick={() => removeHeader(index, key)} size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      : <></>
              }
            />
          </div>
        ))
      }
    />
  );
};
