/* supports a simple CLI to start server and select provider */
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import yargs from "https://deno.land/x/yargs/deno.ts";

import { createApp } from "./src/server/mod.ts";
import { DenoKVConfigStorage } from "./src/adapters/deno/deno-kv-storage.ts";
import { InMemoryConfigStorage } from "./src/server/storages/in-memory-storage.ts";
import { getLogger, setupLogger } from "./src/utils/logger.ts";

// In order to run as of now we need to provide a storage
// to our app to store configurations
// choose Storage

await setupLogger();

const options = yargs(Deno.args)
  .usage("Usage: $0 [options]")
  .option("c", {
    alias: "cache",
    demandOption: true,
    default: "./.app-config.json",
    describe: "Read from JSON file initial AppConfigs",
    type: "string",
  })
  .option("s", {
    alias: "persistConfig",
    demandOption: false,
    default: false,
    describe:
      "Choose this option if you would like that the In Memory Configuration Store is persisted across restarts",
    type: "boolean",
  })
  .option("p", {
    alias: "port",
    demandOption: false,
    default: 8000,
    describe: "Use specific Port to start orchestrator server",
    type: "number",
  })
  .parse();

// const inMemoryConfigStorage = await InMemoryConfigStorage.Create(options.cache);

const storagePromise = options.persist
  ? DenoKVConfigStorage.Create
  : InMemoryConfigStorage.Create;

const storageFactory = () => storagePromise(options.cache);

const app = createApp({
  storageFactory,
});

app.showRoutes();

const logger = getLogger("cli");

await serve(app.fetch, {
  port: options.port,
  onListen: ({ hostname, port }) =>
    logger.info(`Listening on: http://${hostname}:${port}`),
});
