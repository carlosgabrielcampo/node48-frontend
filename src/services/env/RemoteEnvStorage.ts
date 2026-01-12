import { EnvStorageInterface, EnvProfile } from "./EnvStorageTypes";

const toProfileMap = (envs: EnvProfile[]) => Object.fromEntries(envs.map(e => [e.id, e]));

export class RemoteEnvStorage implements EnvStorageInterface {
    get = async (key?: string, defaultValue?: any): Promise<any> => {
      try {
        const response = await (await fetch(`${process.env.origin}/v1/envs/profiles/${key || ""}`)).json();
        if (!response) return defaultValue;
        return response;
      
      } catch (error) {
        return defaultValue;
      }
    };
    update = async ({id, profiles, active}: any): Promise<void> => {
      try {
        const requestBody: any = {}
        if(profiles) requestBody["profiles"] = toProfileMap(profiles) 
        if(active) requestBody["active"] = active
    
        const response = await (await fetch(`${process.env.origin}/v1/envs/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })).json();
    
        if(response.status === 200){ console.info("Env saved") }
        else{ console.error("Failed to save"); }
    
      } catch (e) {
        console.error("Failed to save");
      }
    };
    save = async ({id, profiles, active }: any): Promise<void> => {
      try {
        const requestBody: any = {}
        if(profiles) requestBody["profiles"] = toProfileMap(profiles) 
        if(active) requestBody["active"] = [active]
    
        const response = await (await fetch(`${process.env.origin}/v1/envs/profiles/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        })).json();
    
        if(response.status === 201){ console.info("Env saved") }
        else{ console.error("Failed to save"); }
    
      } catch (e) {
        console.error("Failed to save");
      }
    }
    deleteProfile = async(env, profileName) => {
    }
}
