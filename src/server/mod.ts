import { Hono, HonoTypes } from "../../deps.ts";
import { createMfeRouter } from "../routers/mfe-router.ts";
import { createRegistryRouter } from "../routers/registry-router.ts";
import { ConfigStorageFactory } from "./storages/config-storage.ts";

/*
APIs to support:
- management api (manage new MFE)
- serve available MFE
- server static?
*/

export type AppOptions<Env> = {
  storageFactory: ConfigStorageFactory<Env>;
};

export function createApp<Env extends HonoTypes.Bindings>(
  appOptions: AppOptions<Env>,
) {
  const app = new Hono<{ Bindings: Env }>();

  createRegistryRouter<Env>(app, appOptions);
  createMfeRouter<Env>(app, appOptions);

  return app;
}
