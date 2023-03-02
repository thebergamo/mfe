import { AppResolver } from "./app-resolver.ts";
import { FileSystemAppResolver, FileSystemAppResolverConfig } from "./resolvers/file-system-app-resolver.ts";
import { Strategies } from "./resolvers/strategies.ts";



export class ResolverFactory {
  getResolver<T extends keyof Strategies>(strategy: T, config: Strategies[T]): AppResolver {
    switch (strategy) {
      case 'fs':
        return new FileSystemAppResolver(config);
      default:
        throw new Error(`Missing implementation for ${strategy} strategy`);
    }
  }
}
