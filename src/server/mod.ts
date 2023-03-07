import { createMfeRouter } from "../routers/mfe-router.ts";
import { createRegistryRouter } from "../routers/registry-router.ts";
import { AppConfig } from "./apps-registry.ts";
import { Hono } from "./deps.ts";
import { ConfigStorage } from "./storages/config-storage.ts";

/*
APIs to support:
- management api (manage new MFE)
- serve available MFE
- server static?
*/

export type AppOptions = {
  storage: ConfigStorage<AppConfig>;
};

export function createApp(appOptions: AppOptions) {
  const app = new Hono();

  createRegistryRouter(app, appOptions);
  createMfeRouter(app, appOptions);

  app.showRoutes();

  return app;
}
