import { resolve } from "../../../deps.ts";
import { getLogger } from "../../utils/logger.ts";
import { readCacheFile } from "../../utils/read-cache-file.ts";
import { AppConfig } from "../apps-registry.ts";
import { ConfigStorage } from "./config-storage.ts";

const logger = getLogger("InMemoryConfigStorage");
export class InMemoryConfigStorage implements ConfigStorage<AppConfig> {
  #storage: Map<string, AppConfig>;

  constructor(initialConfig?: AppConfig[]) {
    let defaultConfigs: [string, AppConfig][] = [];

    if (initialConfig) {
      defaultConfigs = initialConfig.map((config) => [config.id, config]);
    }

    this.#storage = new Map(defaultConfigs);
  }

  static async Create(cachePath?: string): Promise<InMemoryConfigStorage> {
    try {
      if (!cachePath) {
        throw new Error("CachePath not provided");
      }

      const cacheConfigs = await readCacheFile(cachePath);
      if (cacheConfigs.length === 0) {
        logger.warn(
          "Your cache config file is empty. No Applications preloaded."
        );
      }
      return new InMemoryConfigStorage(cacheConfigs);
    } catch (err) {
      logger.debug(err);
      return new InMemoryConfigStorage();
    }
  }

  async list(): Promise<AppConfig[]> {
    return await [...this.#storage.values()];
  }
  async get(id: string): Promise<AppConfig> {
    const appConfig = this.#storage.get(id);

    if (!appConfig) {
      throw new Error(`AppConfig: ${id} not found`);
    }

    return await appConfig;
  }
  async put(config: AppConfig): Promise<AppConfig> {
    this.#storage.set(config.id, config);

    return await config;
  }
  async delete(id: string): Promise<void> {
    await this.#storage.delete(id);
  }
}
