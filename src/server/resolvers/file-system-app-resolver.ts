import { join, relative, resolve } from "../../../deps.ts";
import { AppResolver } from "../app-resolver.ts";
import { CommonAppResolverConfig } from "./strategies.ts";

export interface FileSystemAppResolverConfig extends CommonAppResolverConfig {
  baseDir: string;
}

export class FileSystemAppResolver implements AppResolver {
  #baseDir: string;

  constructor(private config: FileSystemAppResolverConfig) {
    this.#baseDir = resolve(Deno.cwd(), config.baseDir);
  }

  async getAssetMap(): Promise<Record<string, string>> {
    const { default: assetsMap } = await import(
      join(this.#baseDir, this.config.assetsMap),
      { assert: { type: "json" } }
    );

    return assetsMap;
  }

  getServerUrl(): string {
    return join(this.#baseDir, this.config.entryServer);
  }

  getAssetUrl(relativePath: string): string {
    return relative(Deno.cwd(), join(this.#baseDir, "client", relativePath));
  }
}
