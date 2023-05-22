import { resolve } from "../../deps.ts";
import { AppConfig } from "../server/apps-registry.ts";
import { getLogger } from "./logger.ts";

const logger = getLogger("readCacheFile");
export async function readCacheFile(
  cachePath = "./app-config.json"
): Promise<AppConfig[]> {
  try {
    const decoder = new TextDecoder("utf-8");
    const cache = await Deno.readFile(resolve(cachePath));

    const cacheConfigs = JSON.parse(decoder.decode(cache));
    logger.debug("Local cache loaded for ConfigStorage");
    return cacheConfigs;
  } catch (err) {
    logger.debug("Default cache config file not found: .app-config.json");
    logger.debug(err);
    logger.info("No applications are preloaded.");
    return [];
  }
}
