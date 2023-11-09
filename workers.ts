import { WorkerKVConfigStorage } from "./src/adapters/cloudflare/worker-kv-storage.ts";
import { WorkerTypes } from "./src/adapters/cloudflare/deps.ts";
import { createApp } from "./src/server/mod.ts";

type WorkerEnv = {
  CONFIGS: WorkerTypes.KVNamespace;
};

const app = createApp<WorkerEnv>({
  storageFactory: (env) => WorkerKVConfigStorage.Create(env.CONFIGS),
});

export default app;
