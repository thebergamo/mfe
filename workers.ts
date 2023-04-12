import { InMemoryConfigStorage } from "./src/server/storages/in-memory-storage.ts";

const app = createApp({
  storage: new InMemoryConfigStorage(),
});

export default app;
