import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { DenoKVConfigStorage } from "./src/adapters/deno/deno-kv-storage.ts";
import { createApp } from "./src/server/mod.ts";
import { getLogger, setupLogger } from "./src/utils/logger.ts";

await setupLogger();

const app = createApp({
  storageFactory: () => DenoKVConfigStorage.Create(),
});

const logger = getLogger("cli");

await serve(app.fetch, {
  onListen: ({ hostname, port }) =>
    logger.info(`Listening on: http://${hostname}:${port}`),
});
