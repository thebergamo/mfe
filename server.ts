import "https://deno.land/std@0.177.1/dotenv/load.ts";
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createApp } from "./src/server/mod.ts";
import { getLogger, setupLogger } from "./src/utils/logger.ts";
import { CreateWorkerKVConfigStorage } from "./src/adapters/deno/workers-kv-storage.ts";

await setupLogger();

const app = createApp({
  storageFactory: () => CreateWorkerKVConfigStorage(),
});

const logger = getLogger("cli");

await serve(app.fetch, {
  onListen: ({ hostname, port }) =>
    logger.info(`Listening on: http://${hostname}:${port}`),
});
