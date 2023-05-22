import { HonoContext, HonoTypes } from "../../deps.ts";
import { AppOptions } from "../server/mod.ts";

export const decorateStorage =
  <Env>(storageFactory: AppOptions<Env>["storageFactory"]) =>
  async (ctx: HonoContext, next: HonoTypes.Next) => {
    const storage = await storageFactory(ctx.env);

    ctx.set("storage", storage);

    return next();
  };
