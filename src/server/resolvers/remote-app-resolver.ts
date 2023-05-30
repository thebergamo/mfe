import {
  HonoContext,
  importModuleDeno,
  importModuleWasm,
} from "../../../deps.ts";
import { AppResolver, ServerEntry } from "../app-resolver.ts";
import { CommonAppResolverConfig } from "./strategies.ts";

export interface RemoteAppResolverConfig extends CommonAppResolverConfig {
  baseUrl: string;
}

export class RemoteAppResolver implements AppResolver {
  #config: RemoteAppResolverConfig;
  #cacheHash: string;
  #runtime: HonoContext["runtime"];

  constructor(
    config: RemoteAppResolverConfig,
    runtime: HonoContext["runtime"],
  ) {
    this.#config = config;
    this.#cacheHash = crypto.randomUUID();
    this.#runtime = runtime;
  }
  async getServerEntry(): Promise<ServerEntry> {
    const importModule = this.#runtime === "deno"
      ? importModuleDeno
      : importModuleWasm;

    const { default: renderApp, routes } = await importModule(
      this.getServerUrl(),
    );

    return { renderApp, routes };
  }

  async getAssetMap(): Promise<Record<string, string>> {
    const cacheString = this.checkLocalUrl() ? `?cache=${this.#cacheHash}` : "";
    const assetMapUrl = `${
      new URL(this.#config.assetsMap, this.#config.baseUrl).href
    }${cacheString}`;

    console.log(`baseUrl: ${this.#config.baseUrl}`);
    console.warn(`AssetMapURL: ${assetMapUrl}`);
    const assetMapResponse = await fetch(assetMapUrl);

    const assetsMap = await assetMapResponse.json();

    console.log("assetsMap", assetsMap);

    return assetsMap;
  }
  getServerUrl(): string {
    const cacheString = this.checkLocalUrl() ? `?cache=${this.#cacheHash}` : "";
    const serverUrl = new URL(this.#config.entryServer, this.#config.baseUrl)
      .href;

    return `${serverUrl}${cacheString}`;
  }
  getAssetUrl(relativePath: string): string {
    return new URL(`client/${relativePath}`, this.#config.baseUrl).href;
  }

  checkLocalUrl() {
    const baseUrl = new URL(this.#config.baseUrl);

    return ["localhost", "127.0.1", "0.0.0.0"].includes(baseUrl.hostname);
  }
}
