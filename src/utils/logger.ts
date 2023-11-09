import { log } from "../../deps.ts";

type LogLevel = "INFO" | "NOTSET" | "DEBUG" | "WARNING" | "ERROR" | "CRITICAL";

export async function setupLogger() {
  // const logLevel = Deno.env.get("MFE_LOG_LEVEL") || "INFO";

  await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler("INFO"),
    },

    loggers: {
      default: {
        handlers: ["console"],
      },
    },
  });
}

export function getLogger(module: string) {
  return new ConsoleLogger(`mfe-${module}`);
}

export class ConsoleLogger {
  #loggerName: string;

  constructor(module: string) {
    this.#loggerName = module;
  }

  info(message: string) {
    console.log(`[INFO][${this.#loggerName}] ${message}`);
  }

  warn(message: string) {
    console.log(`[WARN][${this.#loggerName}] ${message}`);
  }

  debug(message: string) {
    console.log(`[DEBUG][${this.#loggerName}] ${message}`);
  }

  error(message: string) {
    console.log(`[ERROR][${this.#loggerName}] ${message}`);
  }

  critical(message: string) {
    console.log(`[CRITICAL][${this.#loggerName}] ${message}`);
  }
}

class Logger {
  #loggerName: string;
  #logger: log.Logger;

  constructor(module: string) {
    this.#loggerName = module;
    this.#logger = log.getLogger();
  }

  info(message: string) {
    return this.#logger.info(`[${this.#loggerName}] ${message}`);
  }

  warn(message: string) {
    return this.#logger.warning(`[${this.#loggerName}] ${message}`);
  }

  debug(message: string) {
    return this.#logger.debug(`[${this.#loggerName}] ${message}`);
  }

  error(message: string) {
    return this.#logger.error(`[${this.#loggerName}] ${message}`);
  }

  critical(message: string) {
    return this.#logger.critical(`[${this.#loggerName}] ${message}`);
  }
}
