import { EnvStorage, EnvProfile } from "./EnvStorageTypes";

const toProfileMap = (envs: EnvProfile[]) => Object.fromEntries(envs.map(e => [e.id, e]));

export class RemoteEnvStorage implements EnvStorage {
    get = async <T>(key: string, defaultValue: T): Promise<T> => {
      try {
        const response = await (await fetch(`http://localhost:4014/v1/envs/profiles/${key}`)).json();
        if (!response) return defaultValue;
        return response;
      
      } catch (error) {
        return defaultValue;
      }
    };
    update = async <T>({id, profiles, active}): Promise<void> => {
      try {
        const requestBody = {}
        if(profiles) requestBody["profiles"] = toProfileMap(profiles) 
        if(active) requestBody["active"] = active
    
        const response = await (await fetch(`http://localhost:4014/v1/envs/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })).json();
    
        if(response.status === 200){ console.info("Env saved") }
        else{ console.error("Failed to save"); }
        return response
    
      } catch (e) {
        console.log(e)
        console.error("Failed to save");
      }
    };
    save = async <T>({id, profiles, active }): Promise<void> => {
      try {
        const requestBody = {}
        if(profiles) requestBody["profiles"] = toProfileMap(profiles) 
        if(active) requestBody["active"] = [active]
    
        const response = await (await fetch(`http://localhost:4014/v1/envs/profiles/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })).json();
    
        if(response.status === 201){ console.info("Env saved") }
        else{ console.error("Failed to save"); }
    
      } catch (e) {
        console.log(e)
        console.error("Failed to save");
      }
    }
}