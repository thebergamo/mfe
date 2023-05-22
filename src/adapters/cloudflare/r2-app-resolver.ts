import { AppResolver } from "../../server/app-resolver.ts";
import { CommonAppResolverConfig } from "../../server/resolvers/strategies.ts";

export interface R2AppResolverConfig extends CommonAppResolverConfig {
  bucket: R2Bucket;
}

type AssetMap = Record<string, string>;

export class R2AppResolver implements AppResolver {
  #config: R2AppResolverConfig;

  constructor(config: R2AppResolverConfig) {
    this.#config = config;
  }

  async getAssetMap(): Promise<Record<string, string>> {
    const object = await this.#config.bucket.get(this.#config.assetsMap);

    if (!object) {
      throw new Error(`AssetMap (${this.#config.assetsMap}) is missing`);
    }

    const assetMap = await object.json<AssetMap>();

    return assetMap;
  }
  getServerUrl(): string {
    throw new Error("Method not implemented.");
  }
  getAssetUrl(relativePath: string): string {
    throw new Error("Method not implemented.");
  }
}
