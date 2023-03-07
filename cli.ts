/* supports a simple CLI to start server and select provider */
import { serve } from "$std/http/server.ts";
import yargs from "$x/yargs/deno.ts";

import { createApp } from "./server.ts";
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
  .parse();

const inMemoryConfigStorage = await InMemoryConfigStorage.Create(options.cache);

const app = createApp({
  storage: inMemoryConfigStorage,
});

const logger = getLogger("cli");

await serve(app.fetch, {
  onListen: ({ hostname, port }) =>
    logger.info(`Listening on: http://${hostname}:${port}`),
});
