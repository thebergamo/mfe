import { getLogger } from "../../utils/logger.ts";
import { AppConfig } from "../apps-registry.ts";
import { resolve } from "../deps.ts";
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

      const decoder = new TextDecoder("utf-8");
      const cache = await Deno.readFile(resolve(cachePath));

      const cacheConfigs = JSON.parse(decoder.decode(cache));
      logger.info("Local cache loaded for InMemoryConfigStorage");
      return new InMemoryConfigStorage(cacheConfigs);
    } catch (err) {
      logger.debug("Default cache config file not found: .app-config.json");
      logger.debug(err);
      logger.info("No applications are preloaded.");
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
