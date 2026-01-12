import { object } from "zod";
import { EnvProfile, EnvStorageInterface } from "./EnvStorageTypes";


const buildKey = () => {
    const AUTH_TOKEN_KEY = "node48_auth_token";
    const auth_token = localStorage.getItem(AUTH_TOKEN_KEY)
    if(auth_token) return `${auth_token}:env` 
    else return null
};

const localSet = (object) => localStorage.setItem(buildKey(), JSON.stringify(object));


export class LocalEnvStorage implements EnvStorageInterface {
    async get(defaultValue?: any): Promise<any> {
        try {
            const raw = localStorage.getItem(buildKey());
            return raw ? JSON.parse(raw) : defaultValue;
        } catch (err) {
            console.error(err)
            return defaultValue;
        }
    }

    async save({ id, profiles, active }: any): Promise<void> {
        const current = await this.get({[id]: { profiles: {}, active: [] }});
        current[id] = {
            profiles: profiles
                ? { ...current?.[id]?.profiles, ...profiles }
                : current.profiles,
            active: active ? active : current?.[id]?.active ?? [] ,
        }
        localSet(current)
        return current
    }

    async update(options: any): Promise<void> {
        return this.save(options);
    }
    deleteProfile = async(id, profileName) => {
        const current = await this.get({[id]: { profiles: {}, active: [] }});
        if(current?.[id]?.profiles?.[profileName]){
            delete current?.[id]?.profiles?.[profileName]
            localSet(current)
        }
        return current
    }
    setDefault = async(id, profileName) => {
        const current = await this.get({[id]: { profiles: {}, active: [] }});
        const env = current?.[id]
        if(env?.profiles){
            const envProfile = env?.profiles
            Object.keys(envProfile).map((env) => 
                env !== profileName 
                    ? envProfile[env].isDefault = false
                    : envProfile[env].isDefault = true
                )
            localSet(current)
        }
        return current
    }
    setActive = async (id, envId, type) => {
        const current = await this.get({[id]: { profiles: {}, active: [] }});
        let workEnv = current[id];
        let profileFound = {}
        if(!workEnv && type === "global"){
            current[id] = { profiles: {}, active: [] }
            workEnv = { profiles: {}, active: [] }
        }
        if(workEnv){
            if(type === "workflow"){
                profileFound = workEnv.profiles[envId]
                profileFound.scope = type
            }
            if(type === "global"){
                const global = current["global"];
                if(global){
                    profileFound = global.profiles[envId]
                    profileFound.scope = type
                }
            }
            workEnv.active = [...workEnv.active.filter((e) => e.scope !== type), profileFound]
            current[id] = workEnv
            localSet(current)
        } 
        return profileFound
    }
    removeActive = async(id, envId) => {
        const current = await this.get({[id]: { profiles: {}, active: [] }});
        const workEnv = current[id];
        workEnv.active = [...workEnv.active.filter((e) => e.name !== envId)]
        current[id] = workEnv
        localSet(current)
    }
}
