import { AppResolver } from "../app-resolver.ts";
import { AppConfig } from "../apps-registry.ts";
import { join } from "../deps.ts";
import { CommonAppResolverConfig } from "./strategies.ts";

export interface RemoteAppResolverConfig extends CommonAppResolverConfig {
  baseUrl: string;
}

export class RemoteAppResolver implements AppResolver {
  #config: RemoteAppResolverConfig;
  #cacheHash: string;

  constructor(config: RemoteAppResolverConfig) {
    this.#config = config;
    this.#cacheHash = crypto.randomUUID();
  }

  async getAssetMap(): Promise<Record<string, string>> {
    const cacheString = this.checkLocalUrl() ? `?cache=${this.#cacheHash}` : "";
    const assetMapUrl = `${join(
      this.#config.baseUrl,
      this.#config.assetsMap
    )}${cacheString}`;
    const { default: assetsMap } = await import(assetMapUrl, {
      assert: { type: "json" },
    });

    console.log("assetsMap", assetsMap);

    return assetsMap;
  }
  getServerUrl(): string {
    const cacheString = this.checkLocalUrl() ? `?cache=${this.#cacheHash}` : "";
    const serverUrl = join(this.#config.baseUrl, this.#config.entryServer);

    return `${serverUrl}${cacheString}`;
  }
  getAssetUrl(relativePath: string): string {
    return join(this.#config.baseUrl, "client", relativePath);
  }

  checkLocalUrl() {
    const baseUrl = new URL(this.#config.baseUrl);

    return ["localhost", "127.0.1", "0.0.0.0"].includes(baseUrl.hostname);
  }
}
