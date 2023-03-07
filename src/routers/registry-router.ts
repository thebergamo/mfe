import { Hono, HonoTypes } from "../server/deps.ts";
import { AppOptions } from "../server/mod.ts";

export function createRegistryRouter(
  app: Hono<HonoTypes.Env, {}>,
  { storage }: AppOptions
) {
  const registryRouter = new Hono();

  registryRouter.get("/", async (ctx) => {
    return ctx.json(await storage.list());
  });
  registryRouter.post("/", async (ctx) => {
    const appConfig = await ctx.req.json();
    const newConfig = await storage.put(appConfig);

    ctx.status(201);

    return ctx.json(newConfig);
  });
  registryRouter.get(":appId", async (ctx) => {
    const appId = ctx.req.param("appId");

    return ctx.json(await storage.get(appId));
  });
  registryRouter.put(":appId", async (ctx) => {
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
  registryRouter.delete(":appId", async (ctx) => {
    const appId = ctx.req.param("appId");

    await storage.delete(appId);

    return ctx.json({
      message: "Sucessful deleted",
    });
  });

  app.route("/registry", registryRouter);
}
