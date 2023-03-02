import { AppResolver } from "../app-resolver.ts";
import { resolve, join, relative } from "../deps.ts";

export interface FileSystemAppResolverConfig {
  baseDir: string;
}

export class FileSystemAppResolver implements AppResolver {
  private baseDir: string;
  constructor(private config: FileSystemAppResolverConfig) {
    this.baseDir = resolve(Deno.cwd(), config.baseDir);
  }

  getAssetMap(): Promise<Record<string, string>> {
    return import(join(this.baseDir, "client", "assetsMap.json"), { assert: { type: "json" } }) as Promise<
      Record<string, string>
    >;
  }

  getServerUrl(): string {
    // name of the file could be set as the resolver config as well
    return join(this.baseDir, "server", "entry-server.js");
  }

  getAssetUrl(relativePath: string): string {
      return relative(Deno.cwd(), join(this.baseDir, 'client', relativePath));
  }
}
