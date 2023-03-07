import { log } from "../server/deps.ts";

type LogLevel = "INFO" | "NOTSET" | "DEBUG" | "WARNING" | "ERROR" | "CRITICAL";

export async function setupLogger() {
  const logLevel = Deno.env.get("MFE_LOG_LEVEL") || "INFO";

  await log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler(logLevel as LogLevel),
    },

    loggers: {
      default: {
        handlers: ["console"],
      },
    },
  });
}

export function getLogger(module: string) {
  return new Logger(`mfe-${module}`);
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
