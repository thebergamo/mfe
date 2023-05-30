import { HonoContext } from "../../deps.ts";
import { AppResolver } from "./app-resolver.ts";
import {
  FileSystemAppResolver,
  FileSystemAppResolverConfig,
} from "./resolvers/file-system-app-resolver.ts";
import {
  RemoteAppResolver,
  RemoteAppResolverConfig,
} from "./resolvers/remote-app-resolver.ts";
import { ResolverStrategies } from "./resolvers/strategies.ts";

export class ResolverFactory {
  static getResolver<T extends keyof ResolverStrategies>(
    strategy: T,
    config: ResolverStrategies[T],
    runtime: HonoContext["runtime"],
  ): AppResolver {
    switch (strategy) {
      case "fs":
        return new FileSystemAppResolver(config as FileSystemAppResolverConfig);
      case "remote":
        return new RemoteAppResolver(
          config as RemoteAppResolverConfig,
          runtime,
        );
      default:
        throw new Error(`Missing implementation for ${strategy} strategy`);
    }
  }
}
