import { getLogger } from "../../utils/logger.ts";
import { AppConfig } from "../../server/apps-registry.ts";
import { ConfigStorage } from "../../server/storages/config-storage.ts";
import { readCacheFile } from "../../utils/read-cache-file.ts";

const logger = getLogger("DenoKVConfigStorage");
export class DenoKVConfigStorage implements ConfigStorage<AppConfig> {
  #storage: Deno.Kv;
  #namespace: string;

  constructor(kv: Deno.Kv, namespace: string) {
    this.#storage = kv;
    this.#namespace = namespace;
  }

  static async Create(cachePath?: string): Promise<DenoKVConfigStorage> {
    const cacheFile = cachePath ? `${cachePath}.kv` : undefined;
    const kv = await Deno.openKv(cacheFile);
    const configStorage = new DenoKVConfigStorage(kv, "config");

    try {
      const cachedConfigs = await readCacheFile(cachePath);
      if (cachedConfigs.length === 0) {
        logger.warn(
          "Your cache config file is empty. No Applications preloaded."
        );
      }

      const cachedKeysPromise = cachedConfigs.map((c) => configStorage.put(c));

      await Promise.all(cachedKeysPromise);
    } catch (err) {
      logger.error(err);
      logger.warn("No applications preloaded");
    }

    return configStorage;
  }

  async list(): Promise<AppConfig[]> {
    const configs = this.#storage.list<string>({ prefix: [this.#namespace] });
    const result = [];

    for await (const config of configs) {
      result.push(JSON.parse(config.value));
    }

    return result;
  }
  async get(id: string): Promise<AppConfig> {
    const appConfig = await this.#storage.get<string>([this.#namespace, id]);

    if (!appConfig.value) {
      throw new Error(`AppConfig: ${id} not found`);
    }

    return JSON.parse(appConfig.value);
  }
  async put(config: AppConfig): Promise<AppConfig> {
    await this.#storage.set(
      [this.#namespace, config.id],
      JSON.stringify(config)
    );

    return config;
  }
  async delete(id: string): Promise<void> {
    await this.#storage.delete([this.#namespace, id]);
  }
}
