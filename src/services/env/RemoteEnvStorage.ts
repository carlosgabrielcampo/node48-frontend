import { EnvStorageInterface } from "./EnvStorageTypes";

export class RemoteEnvStorage implements EnvStorageInterface {
    get = async (key?: string): Promise<void> => {
      try {
        const response = await (await fetch(`${process.env.origin}/v1/envs/profiles/${key || ""}`)).json();
        if (!response) return null;
        return response;
      
      } catch (error) {
        return null;
      }
    };
    update = async ({id, profiles}): Promise<void> => {
      try {
        const response = await (await fetch(`${process.env.origin}/v1/envs/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profiles),
        })).json();
    
        if(response.status === 200){ console.info("Env saved") }
        else{ console.error("Failed to save"); }
    
      } catch (e) {
        console.error("Failed to save");
      }
    };
    save = async ({id, profiles}): Promise<void> => {
      try {
    
        const response = await (await fetch(`${process.env.origin}/v1/envs/profiles/${id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profiles),
        })).json();
    
        if(response.status === 201){ console.info("Env saved") }
        else{ console.error("Failed to save"); }
    
      } catch (e) {
        console.error("Failed to save");
      }
    }
    deleteProfile = async(env, profileId) => {
    }
    setDefault = async(id, profileId) => {
    }
    setActive = async (id, envId, type) => {
    }
    removeActive = async(id, envId, type) => {
    }
}
