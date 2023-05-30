import type {
  ReactDOMServerReadableStream,
  RouteData,
  RouteObject,
  Router,
  StaticHandlerContext,
} from "../../deps.ts";
import { AppConfig } from "./apps-registry.ts";

export type MfeContext = {
  assetsMap: Record<string, string>;
  scripts?: string[];
  styles?: string[];
  title?: string;
  menu: AppConfig["navbar"];
  id: string;
  routerHydration: {
    loaderData?: RouteData;
  };
};

export interface AppContext {
  mfeContext: MfeContext;
  router: Router;
  context: StaticHandlerContext;
  bootstrapScript: string;
}
export interface ServerEntry {
  routes: RouteObject[];
  renderApp: (
    context: AppContext,
  ) => ReactDOMServerReadableStream;
}

export interface AppResolver {
  getAssetMap(): Promise<Record<string, string>>;
  getServerUrl(): string;

  /**
   * Returns absolute url for asset given relative path.
   */
  getAssetUrl(relativePath: string): string;
  getServerEntry(): Promise<ServerEntry>;
}
