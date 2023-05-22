import { R2AppResolverConfig } from "../../adapters/cloudflare/r2-app-resolver.ts";
import { FileSystemAppResolverConfig } from "./file-system-app-resolver.ts";
import { RemoteAppResolverConfig } from "./remote-app-resolver.ts";

export interface CommonAppResolverConfig {
  entryServer: string;
  assetsMap: string;
}

export type ResolverStrategies = {
  fs: FileSystemAppResolverConfig;
  remote: RemoteAppResolverConfig;
  r2: R2AppResolverConfig;
};
