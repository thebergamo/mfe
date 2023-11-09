import { FileSystemAppResolverConfig } from "./file-system-app-resolver.ts";
import { RemoteAppResolverConfig } from "./remote-app-resolver.ts";

export interface CommonAppResolverConfig {
  entryServer: string;
  assetsMap: string;
}

export type ResolverStrategies = {
  fs: FileSystemAppResolverConfig;
  remote: RemoteAppResolverConfig;
};
