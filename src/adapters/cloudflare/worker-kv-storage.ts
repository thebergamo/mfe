import { getLogger } from "../../utils/logger.ts";
import { AppConfig } from "../../server/apps-registry.ts";
import { ConfigStorage } from "../../server/storages/config-storage.ts";

import { WorkerTypes } from "./deps.ts";

const logger = getLogger("WorkerKVConfigStorage");
export class WorkerKVConfigStorage implements ConfigStorage<AppConfig> {
  #storage: WorkerTypes.KVNamespace;

  constructor(namespace: WorkerTypes.KVNamespace) {
    this.#storage = namespace;
  }

  static Create(namespace: WorkerTypes.KVNamespace): WorkerKVConfigStorage {
    return new WorkerKVConfigStorage(namespace);
  }

  async list(): Promise<AppConfig[]> {
    const { keys }: { keys: { name: string }[] } = await this.#storage.list();

    logger.info(`Loading configs: ${keys.length} found`);

    const keysPromise = keys.map(({ name: key }) =>
      this.#storage.get(key, { type: "json" })
    );

    const response = await Promise.all(keysPromise);

    return response;
  }
  async get(id: string): Promise<AppConfig> {
    const appConfig = await this.#storage.get(id, { type: "json" });

    if (!appConfig) {
      throw new Error(`AppConfig: ${id} not found`);
    }

    return appConfig;
  }
  async put(config: AppConfig): Promise<AppConfig> {
    await this.#storage.put(config.id, JSON.stringify(config));

    return config;
  }
  async delete(id: string): Promise<void> {
    await this.#storage.delete(id);
  }
}
