import { WorkerKVConfigStorage } from "../cloudflare/worker-kv-storage.ts";

import { ApiKVNamespace } from "./deps.ts";

export function CreateWorkerKVConfigStorage() {
  const accountId = Deno.env.get("cf_account_id");
  const namespaceId = Deno.env.get("cf_namespace_id");
  const apiToken = Deno.env.get("cf_api_token");

  const namespace = new ApiKVNamespace(accountId, apiToken, namespaceId);

  return new WorkerKVConfigStorage(namespace);
}
