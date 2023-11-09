import { Hono, HonoContext, HonoTypes } from "../../deps.ts";
import { AppOptions } from "../server/mod.ts";
import { decorateStorage } from "./storage.middleware.ts";

export function createRegistryRouter<Env extends HonoTypes.Bindings>(
  app: Hono<{ Bindings: Env }>,
  { storageFactory }: AppOptions<Env>
) {
  const registryRouter = new Hono();

  registryRouter.use("*", decorateStorage<Env>(storageFactory));

  registryRouter.get("/", async (ctx: HonoContext) => {
    try {
      const storage = ctx.get("storage");
      return ctx.json(await storage.list());
    } catch (err) {
      console.log("ERR: ", err);
      return ctx.json(err);
    }
  });
  registryRouter.post("/", async (ctx: HonoContext) => {
    const storage = ctx.get("storage");
    const appConfig = await ctx.req.json();
    const newConfig = await storage.put(appConfig);

    ctx.status(201);

    return ctx.json(newConfig);
  });
  registryRouter.get(":appId", async (ctx: HonoContext) => {
    const storage = ctx.get("storage");
    const appId = ctx.req.param("appId");

    return ctx.json(await storage.get(appId));
  });
  registryRouter.put(":appId", async (ctx: HonoContext) => {
    const storage = ctx.get("storage");
    const appId = ctx.req.param("appId");
    const appConfig = await ctx.req.json();

    if (appId !== appConfig.id) {
      ctx.status(409);
      return ctx.json({
        error: "Conflict",
        message: "Provided appId from URL is different from body",
      });
    }

    const newConfig = await storage.put(appConfig);

    return ctx.json(newConfig);
  });
  registryRouter.delete(":appId", async (ctx: HonoContext) => {
    const storage = ctx.get("storage");
    const appId = ctx.req.param("appId");

    await storage.delete(appId);

    return ctx.json({
      message: "Sucessful deleted",
    });
  });

  app.route("/registry", registryRouter);
}
