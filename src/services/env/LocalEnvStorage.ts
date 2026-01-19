import { object } from "zod";
import { EnvProfile, EnvStorageInterface } from "./EnvStorageTypes";


const buildKey = (): string | null => {
    const AUTH_TOKEN_KEY = "node48_auth_token";
    const auth_token = localStorage.getItem(AUTH_TOKEN_KEY)
    if(auth_token) return `${auth_token}:env` 
    else return null
};

const localSet = (object): string => {
    try {
        localStorage.setItem(buildKey(), JSON.stringify(object));
        return JSON.parse(localStorage.getItem(buildKey()))
    } catch (error) {
        console.error(error)
    }
}


export class LocalEnvStorage implements EnvStorageInterface {
    async get(): Promise<EnvProfile> {
        try {
            const raw = localStorage.getItem(buildKey());
            return raw ? JSON.parse(raw) : {};
        } catch (err) {
            return {};
        }
    }
    async save({ id, profiles}: any): Promise<void> {
        const current = await this.get();
        const currentProfiles = current?.[id]?.profiles
        const allProfiles = currentProfiles ? Object.values(currentProfiles).filter((e) => e?.isDefault) : []
        
        if(id === "global" && !(currentProfiles && allProfiles?.length)){
            const key = Object.keys(profiles)[0]
            profiles[key].isDefault = true 
        }   
        current[id] = {
            ...current[id], profiles: profiles
                ? { ...currentProfiles, ...profiles }
                : current.profiles,
        }
        localSet(current)
        return current
    }
    async update(options: any): Promise<void> {
        return this.save(options);
    }
    deleteProfile = async(id, profileId) => {
        const current = await this.get();
        if(current?.[id]?.profiles?.[profileId]){
            delete current?.[id]?.profiles?.[profileId]
            localSet(current)
        }
        return current
    }
    setDefault = async(id, profileId) => {
        const current = await this.get();
        const env = current?.[id]
        if(env?.profiles){
            const envProfile = env?.profiles
            Object.keys(envProfile).map((env) => 
                env !== profileId 
                    ? envProfile[env].isDefault = false
                    : envProfile[env].isDefault = true
                )
            localSet(current)
        }
        return current
    }
    setActive = async (id, envId, type) => {
        const current = await this.get();
        const workEnv = current[id] ?? { profiles: {}, global: "" };
        if(type === "workflow") workEnv.activeLocal = envId
        if(type === "global") workEnv.global = envId
        current[id] = workEnv
        return localSet(current)
    }
    removeActive = async(id, envId, type) => {
        const current = await this.get();
        const workEnv = current[id] ?? { profiles: {}, global: "" };
        if(type === "workflow") delete workEnv.activeLocal
        if(type === "global") delete workEnv.global
        current[id] = workEnv
        return localSet(current)
    }
}
