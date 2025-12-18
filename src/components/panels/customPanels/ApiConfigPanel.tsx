import { ApiConfigPanelProps, ApiConfig } from "@/types/panels";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { LabeledDropdown } from "../../layout/dropdown";
import { CodeTextarea } from "@/components/layout/textArea";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { LabeledInput } from "@/components/layout/input";
import { LabeledCard } from "@/components/layout/card";
type ObjectRow = {
  id: string;
  key: string;
  value: string | unknown;
};

interface PanelProps {
  props: any;
}


// const ConfigPanel = ({registerCommit, open, defaultPanelInfo}) => {

// }

export const ApiConfigPanel = ({ state, setState, registerCommit, open, defaultPanelInfo }: ApiConfigPanelProps) => {
  const [panelState, setPanelState] = useState<PanelProps>(defaultPanelInfo)
  const [params, setParams] = useState<ObjectRow[]>([]);
  const [raw, setRaw] = useState(() => JSON.stringify(state[0]?.body || {}, null, 2));
  
  const idMap = useRef<Record<string, string>>({});
  // Ensure we have at least one config
  
  const commitParams = useCallback((prev: any[]) => {
    const paramsObject = Object.fromEntries(
      params.map(p => [p.key, p.value])
    );
    const updated = [...prev];
    updated[0] = { ...updated[0], params: paramsObject };
    return updated
  }, [params]);

  useEffect(() => {
    registerCommit(commitParams);
  }, [registerCommit, commitParams]);

  useEffect(() => {
    if (!open) return;
    setParams(
      Object.entries(state[0]?.params ?? {}).map(([key, value]) => {
        if (!idMap.current[key]) idMap.current[key] = crypto.randomUUID();
        return { id: idMap.current[key], key, value };
      })
    );
    if (state[0]?.body) {
      setRaw(JSON.stringify(state[0].body, null, 2));
    }
    setPanelState(state)
  }, [open, state]);

  const updateParam = ( index: number, patch: Partial<ObjectRow> ) => 
    setParams(prev => prev.map((p, i) => i === index ? { ...p, ...patch } : p ));

  const addParams = () => setParams(prev => [ ...prev, { id: crypto.randomUUID(), key: "", value: "" } ]);
  const removeParams = (id: string) => setParams(prev => prev.filter(p => p.id !== id));
  

  const updateConfig = (index: number, updates: Partial<ApiConfig>) => {
    const updated = [...state];
    updated[index] = { ...updated[index], ...updates };
    setState(updated);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setRaw(text);
    try {
      const parsed = JSON.parse(text);
      updateConfig(0, { body: parsed });
    } catch (_) {
      //
    }
  };

  const addHeader = (index: number) => {
    const updated = [...state];
    updated[index] = { ...updated[index], headers: { ...updated[index].headers, "": "" } };
    setState(updated);
  };

  const removeHeader = (configIndex: number, key: string) => {
    const updated = [...state];
    const { [key]: _, ...rest } = updated[configIndex].headers;
    updated[configIndex] = { ...updated[configIndex], headers: rest };
    setState(updated);
  };

  const updateHeader = (configIndex: number, oldKey: string, newKey: string, value: string) => {
    console.log({ configIndex, oldKey, newKey, value })
    const updated = [...state];

    console.log({configIndex: updated[configIndex].headers})
    // const { [oldKey]: _, ...rest } = updated[configIndex].headers;
    // updated[configIndex] = { ...updated[configIndex], headers: { ...rest, [newKey]: value } };
    
    setState(updated);
  };


  return (
      <LabeledCard
        label={"API Configuration"}
        headerChildren={<></>}
        cardChildren={
          state && state?.map((parameters, index) => (
            <div key={index} className="space-y-4 p-3 w-full">
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
              <LabeledDropdown  itemsList={[
                {itemProperties: {value: "GET"}, itemDisplay: "GET"},
                {itemProperties: {value: "POST"}, itemDisplay: "POST"},
                {itemProperties: {value: "PUT"}, itemDisplay: "PUT"},
                {itemProperties: {value: "PATCH"}, itemDisplay: "PATCH"},
                {itemProperties: {value: "DELETE"}, itemDisplay: "DELETE"},
              ]} 
                label={"Method"}
                onSelect={({value}) => updateConfig(index, { method: value })}
                header={parameters.method}
              />
              <LabeledDropdown itemsList={[
                {itemProperties: {value: "json"}, itemDisplay: "JSON"},
                {itemProperties: {value: "text"}, itemDisplay: "TEXT"},
              ]} 
                label={"Response Format"}
                onSelect={({value}) => updateConfig(index, { reponseFormat: value })}
                header={parameters.reponseFormat}
              />
              <LabeledInput 
                label={"OutputVar"}
                value={parameters.outputVar}
                placeholder="apiAuthorized"
                onChange={(e) => updateConfig(index, { outputVar: e.target.value })}
                className="mt-1"
              />
              <LabeledCard 
                label={"Params"}
                headerChildren={
                  <Button onClick={() => addParams()} size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                }
                cardChildren={
                  params?.length ? params.map(({id, key, value}, i) => (
                    <div key={id} className="flex gap-2">
                      <Input
                        value={key}
                        onChange={e => updateParam(i, { key: e.target.value })}
                        placeholder="Key"
                        className="flex-1"
                      />
                      <Input
                        value={value}
                        onChange={e => updateParam(i, { value: e.target.value })}
                        placeholder="Value"
                        className="flex-1"
                      />
                      <Button onClick={() => removeParams(id) } size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                  : <></>
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
                  <div className="flex gap-2">
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
                  <div className="">
                    <LabeledDropdown 
                      header={parameters.bodyType || "none"} 
                      itemsList={[
                        {itemProperties: {value: "none"}, itemDisplay: "none"},
                        {itemProperties: {value: "raw"}, itemDisplay: "raw"},
                        {itemProperties: {value: "xxx-url-encoded"}, itemDisplay: "xxx-url-encoded"},
                        {itemProperties: {value: "form-data"}, itemDisplay: "form-data"},
                      ]}
                      onSelect={({value}) => updateConfig(index, { bodyType: value })}
                    />
                  </div>
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


// const ConfigPanelComponent = ({label, header, children}) => {
//     return (
//       <LabeledCard
//         label={label}
//         headerChildren={header}
//         cardChildren={
//           state && state?.map((parameters, index) => (
//             <div key={index} className="space-y-4 p-3 w-full">
//               <LabeledInput 
//                 label={"Base URL"}
//                 value={parameters.baseUrl}
//                 placeholder="http://localhost:3009"
//                 onChange={(e) => updateConfig(index, { baseUrl: e.target.value })}
//                 className="mt-1"
//               />
//               <LabeledInput 
//                 label={"Endpoint"}
//                 value={parameters.endpoint}
//                 placeholder="/api/webhook/status"
//                 onChange={(e) => updateConfig(index, { endpoint: e.target.value })}
//                 className="mt-1"
//               />
//               <LabeledDropdown  itemsList={[
//                 {itemProperties: {value: "GET"}, itemDisplay: "GET"},
//                 {itemProperties: {value: "POST"}, itemDisplay: "POST"},
//                 {itemProperties: {value: "PUT"}, itemDisplay: "PUT"},
//                 {itemProperties: {value: "PATCH"}, itemDisplay: "PATCH"},
//                 {itemProperties: {value: "DELETE"}, itemDisplay: "DELETE"},
//               ]} 
//                 label={"Method"}
//                 onSelect={({value}) => updateConfig(index, { method: value })}
//                 header={parameters.method}
//               />
//               <LabeledDropdown itemsList={[
//                 {itemProperties: {value: "json"}, itemDisplay: "JSON"},
//                 {itemProperties: {value: "text"}, itemDisplay: "TEXT"},
//               ]} 
//                 label={"Response Format"}
//                 onSelect={({value}) => updateConfig(index, { reponseFormat: value })}
//                 header={parameters.reponseFormat}
//               />
//               <LabeledInput 
//                 label={"OutputVar"}
//                 value={parameters.outputVar}
//                 placeholder="apiAuthorized"
//                 onChange={(e) => updateConfig(index, { outputVar: e.target.value })}
//                 className="mt-1"
//               />
//               <LabeledCard 
//                 label={"Params"}
//                 headerChildren={
//                   <Button onClick={() => addParams()} size="sm" variant="outline">
//                     <Plus className="h-4 w-4 mr-1" />
//                     Add
//                   </Button>
//                 }
//                 cardChildren={
//                   params?.length ? params.map(({id, key, value}, i) => (
//                     <div key={id} className="flex gap-2">
//                       <Input
//                         value={key}
//                         onChange={e => updateParam(i, { key: e.target.value })}
//                         placeholder="Key"
//                         className="flex-1"
//                       />
//                       <Input
//                         value={value}
//                         onChange={e => updateParam(i, { value: e.target.value })}
//                         placeholder="Value"
//                         className="flex-1"
//                       />
//                       <Button onClick={() => removeParams(id) } size="sm" variant="ghost">
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   ))
//                   : <></>
//                 }
//               />
//               <LabeledCard 
//                 label={"Headers"}
//                 headerChildren={
//                   <Button onClick={() => addHeader(index)} size="sm" variant="outline">
//                     <Plus className="h-4 w-4 mr-1" />
//                     Add
//                   </Button>
//                 }
//                 cardChildren={Object.entries(parameters?.headers || {}).map(([key, value]) => (
//                   <div className="flex gap-2">
//                     <Input
//                       value={key}
//                       onChange={(e) => updateHeader(index, key, e.target.value, value)}
//                       placeholder="Key"
//                       className="flex-1"
//                     />
//                     <Input
//                       value={value}
//                       onChange={(e) => updateHeader(index, key, key, e.target.value)}
//                       placeholder="Value"
//                       className="flex-1"
//                     />
//                     <Button onClick={() => removeHeader(index, key)} size="sm" variant="ghost">
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 ))}
//               />
//               <LabeledCard 
//                 label={"Body"}
//                 headerChildren={
//                   <div className="">
//                     <LabeledDropdown 
//                       header={parameters.bodyType || "none"} 
//                       itemsList={[
//                         {itemProperties: {value: "none"}, itemDisplay: "none"},
//                         {itemProperties: {value: "raw"}, itemDisplay: "raw"},
//                         {itemProperties: {value: "xxx-url-encoded"}, itemDisplay: "xxx-url-encoded"},
//                         {itemProperties: {value: "form-data"}, itemDisplay: "form-data"},
//                       ]}
//                       onSelect={({value}) => updateConfig(index, { bodyType: value })}
//                     />
//                   </div>
//                 }
//                 cardChildren={
//                   parameters.bodyType === "raw" 
//                     ? <CodeTextarea value={raw} onChange={handleChange} className="min-h-[300px]"/> 
//                     : parameters.bodyType === "xxx-url-encoded" 
//                       ? Object.entries(parameters?.body || {}).map(([key, value]) => (
//                         <div key={key} className="flex gap-2">
//                           <Input
//                             value={key}
//                             onChange={(e) => updateHeader(index, key, e.target.value, String(value))}
//                             placeholder="Key"
//                             className="flex-1"
//                           />
//                           <Input
//                             value={String(value)}
//                             onChange={(e) => updateHeader(index, key, key, e.target.value)}
//                             placeholder="Value"
//                             className="flex-1"
//                           />
//                           <Button onClick={() => removeHeader(index, key)} size="sm" variant="ghost">
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       ))
//                       : parameters.bodyType === "form-data" 
//                         ? Object.entries(parameters?.body || {}).map(([key, value]) => (
//                             <div key={key} className="flex gap-2">
//                               <Input
//                                 value={key}
//                                 onChange={(e) => updateHeader(index, key, e.target.value, String(value))}
//                                 placeholder="Key"
//                                 className="flex-1"
//                               />
//                               <Input
//                                 value={String(value)}
//                                 onChange={(e) => updateHeader(index, key, key, e.target.value)}
//                                 placeholder="Value"
//                                 className="flex-1"
//                               />
//                               <Button onClick={() => removeHeader(index, key)} size="sm" variant="ghost">
//                                 <Trash2 className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           ))
//                         : <></>
//                 }
//               />
//             </div>
//           ))
//         }
//       />
//   );
// }

// {
//   "ApiConfigPanel": {
//     "type": "container",
//     "children": [
//       {
//         "LabeledInput": {
//           "label": "Base URL",
//           "bind": "baseUrl",
//           "placeholder": "http://localhost:3009",
//           "component": "input",
//           "valueType": "string"
//         }
//       },
//       {
//         "LabeledInput": {
//           "label": "Endpoint",
//           "bind": "endpoint",
//           "placeholder": "/api/webhook/status",
//           "component": "input",
//           "valueType": "string"
//         }
//       },
//       {
//         "LabeledDropdown": {
//           "label": "Method",
//           "bind": "method",
//           "component": "select",
//           "options": ["GET", "POST", "PUT", "PATCH", "DELETE"]
//         }
//       },
//       {
//         "LabeledDropdown": {
//           "label": "Response Format",
//           "bind": "responseFormat",
//           "component": "select",
//           "options": ["json", "text"]
//         }
//       },
//       {
//         "LabeledInput": {
//           "label": "OutputVar",
//           "bind": "outputVar",
//           "placeholder": "apiAuthorized",
//           "component": "input",
//           "valueType": "string"
//         }
//       },
//       {
//         "LabeledCard": {
//           "label": "Params",
//           "type": "keyValueList",
//           "actions": ["add", "remove"],
//           "itemSchema": {
//             "Key": {
//               "component": "input",
//               "placeholder": "Key"
//             },
//             "Value": {
//               "component": "input",
//               "placeholder": "Value"
//             }
//           }
//         }
//       },
//       {
//         "LabeledCard": {
//           "label": "Headers",
//           "type": "keyValueList",
//           "actions": ["add", "remove"],
//           "itemSchema": {
//             "Key": {
//               "component": "input",
//               "placeholder": "Key"
//             },
//             "Value": {
//               "component": "input",
//               "placeholder": "Value"
//             }
//           }
//         }
//       },
//       {
//         "LabeledCard": {
//           "label": "Body",
//           "type": "conditional",
//           "switch": {
//             "bind": "bodyType",
//             "options": {
//               "none": {
//                 "component": "empty"
//               },
//               "raw": {
//                 "component": "CodeTextarea",
//                 "language": "json"
//               },
//               "xxx-url-encoded": {
//                 "component": "keyValueList",
//                 "itemSchema": {
//                   "Key": { "component": "input" },
//                   "Value": { "component": "input" }
//                 }
//               },
//               "form-data": {
//                 "component": "keyValueList",
//                 "itemSchema": {
//                   "Key": { "component": "input" },
//                   "Value": { "component": "input" }
//                 }
//               }
//             }
//           }
//         }
//       }
//     ]
//   }
// }
