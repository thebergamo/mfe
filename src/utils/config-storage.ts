import { AppConfig } from "../server/apps-registry.ts";

export interface ConfigStorage<Config> {
  list(): Promise<Config[]>;
  get(id: string): Promise<Config>;
  put(config: Config): Promise<Config>;
  delete(id: string): Promise<void>;
}

export class InMemoryConfigStorage implements ConfigStorage<AppConfig> {
  #storage: Map<string, AppConfig>;

  constructor(initialConfig?: AppConfig[]) {
    let defaultConfigs: [string, AppConfig][] = [];

    if (initialConfig) {
      defaultConfigs = initialConfig.map((config) => ([config.id, config]))
    }

    this.#storage = new Map(defaultConfigs);
  }

  async list(): Promise<AppConfig[]> {
    return await [...this.#storage.values()];
  }
  async get(id: string): Promise<AppConfig> {
    const appConfig = this.#storage.get(id);

    if (!appConfig) {
      throw new Error('AppConfig not found')
    }

    return await appConfig;
  }
  async put(config: AppConfig): Promise<AppConfig> {
    this.#storage.set(config.id, config);

    return await config;
  }
  async delete(id: string): Promise<void> {
    await this.#storage.delete(id)
  }
}
