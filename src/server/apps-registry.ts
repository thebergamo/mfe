/*
    - manage apps
    - receive a storage implementation
*/

import { ConfigStorage } from "../utils/config-storage.ts";

interface NavbarConfig {
  id: string;
  label: string;
  href: string;
}

interface ProxyConfig {
  id: string;
  target: string;
}

export interface AppConfig {
  id: string;
  name: string;
  path: string;
  app: string;
  assetsMap: Record<string, string>;
  artifacts: string[];
  navbar: NavbarConfig[];
  proxy: ProxyConfig[];
}

interface AppRegistry {
  getApps(): Promise<AppConfig[]>;
  getApp(id: string): Promise<AppConfig>;
  putApp(config: AppConfig): Promise<AppConfig>;
  removeApp(id: string): Promise<void>;
}

export class AppsRegistry implements AppRegistry {
  constructor(private configStorage: ConfigStorage<AppConfig>) {}

  getApps(): Promise<AppConfig[]> {
    return this.configStorage.list();
  }
  getApp(id: string): Promise<AppConfig> {
    return this.configStorage.get(id);
  }
  putApp(config: AppConfig): Promise<AppConfig> {
    return this.configStorage.put(config);
  }
  removeApp(id: string): Promise<void> {
    return this.configStorage.delete(id);
  }
}
