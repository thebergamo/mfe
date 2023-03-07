export interface ConfigStorage<Config> {
  list(): Promise<Config[]>;
  get(id: string): Promise<Config>;
  put(config: Config): Promise<Config>;
  delete(id: string): Promise<void>;
}
