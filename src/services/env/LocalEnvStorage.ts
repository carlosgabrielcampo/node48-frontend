import { EnvProfile, EnvStorageInterface } from "./EnvStorageTypes";


const buildKey = () => {
    const AUTH_TOKEN_KEY = "node48_auth_token";
    const auth_token = localStorage.getItem(AUTH_TOKEN_KEY)
    if(auth_token) return `${auth_token}:env` 
    else return null
};

export class LocalEnvStorage implements EnvStorageInterface {
    async get(key?: string, defaultValue?: any): Promise<any> {
        try {
            const raw = localStorage.getItem(buildKey());
            return raw ? JSON.parse(raw) : defaultValue;
        } catch (err) {
            console.error(err)
            return defaultValue;
        }
    }

    async save({ id, profiles, active }: any): Promise<void> {
        const current = await this.get(id, {[id]: { profiles: {}, active: [] }});
        current[id] = {
            profiles: profiles
                ? { ...current?.[id]?.profiles, ...profiles }
                : current.profiles,
            active: active ? active : current?.[id]?.active ?? [] ,
        }
        localStorage.setItem(buildKey(), JSON.stringify(current));
        return current
    }

    async update(options: any): Promise<void> {
        return this.save(options);
    }
    deleteProfile = async(id, profileName) => {
        const current = await this.get(id, {[id]: { profiles: {}, active: [] }});
        if(current?.[id]?.profiles?.[profileName]){
            delete current?.[id]?.profiles?.[profileName]
            localStorage.setItem(buildKey(), JSON.stringify(current));
        }
        return current
    }
    setDefault = async(id, profileName) => {
        const current = await this.get(id, {[id]: { profiles: {}, active: [] }});
        const env = current?.[id]
        if(env?.profiles){
            const envProfile = env?.profiles
            Object.keys(envProfile).map((env) => 
                env !== profileName 
                    ? envProfile[env].isDefault = false
                    : envProfile[env].isDefault = true
                )
            localStorage.setItem(buildKey(), JSON.stringify(current));
        }
        return current
    }
}
