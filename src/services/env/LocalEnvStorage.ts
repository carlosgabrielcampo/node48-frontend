import { EnvProfile, EnvStorageInterface } from "./EnvStorageTypes";
const STORAGE_PREFIX = "env-manager";

const buildKey = (id: string) => `${STORAGE_PREFIX}:${id}`;

const toProfileMap = (envs: EnvProfile[]) => Object.fromEntries(envs.map(e => [e.id, e]));

export class LocalEnvStorage implements EnvStorageInterface {
    async get<T>(key: string, defaultValue: T): Promise<T> {
        try {
            const raw = localStorage.getItem(buildKey(key));            
            return raw ? (JSON.parse(raw) as T) : defaultValue;
        } catch (err) {
            console.error(err)
            return defaultValue;
        }
    }

    async save({ id, profiles, active }: any): Promise<void> {
        const current = await this.get<any>(id, { profiles: {}, active: [] });

        const next = {
            profiles: profiles
                ? { ...current.profiles, ...toProfileMap(profiles) }
                : current.profiles,
            active: active ?? current.active,
        };

        localStorage.setItem(buildKey(id), JSON.stringify(next));
        return next
    }

    async update(options: any): Promise<void> {
        return this.save(options);
    }
}
