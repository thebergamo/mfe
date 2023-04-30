import { ResolverFactory } from "../server/app-resolve-factory.ts";
import { AppResolver } from "../server/app-resolver.ts";
import { AppConfig } from "../server/apps-registry.ts";
import {
  Hono,
  HonoContext,
  HonoTypes,
  HTTPException,
  serveStatic,
} from "../server/deps.ts";
import { AppOptions } from "../server/mod.ts";
import { render } from "../server/render.tsx";
import { getLogger } from "../utils/logger.ts";

const logger = getLogger("MfeRouter");

function getResolver(appConfig: AppConfig) {
  const { strategy, strategyConfig } = appConfig.resolver;
  return ResolverFactory.getResolver(strategy, strategyConfig);
}

const decorateStorage =
  (storage: AppOptions["storage"]) =>
  async (ctx: HonoContext, next: HonoTypes.Next) => {
    console.info("INCOMING", ctx.req.url);

    const { mfeId } = ctx.req.param() as { mfeId: string };
    console.log({ mfeId });
    try {
      const appConfig = await storage.get(mfeId);

      ctx.set("appConfig", appConfig);
      ctx.set("appResolver", getResolver(appConfig));
    } catch (err) {
      logger.error(err);
      if (err.message.includes("AppConfig not found")) {
        return ctx.notFound();
      }

      throw new HTTPException(500);
    }

    await next();
  };

export function createMfeRouter(
  app: Hono<HonoTypes.Env, {}>,
  { storage }: AppOptions
) {
  const mfeRouter = new Hono<{
    Variables: { appConfig: AppConfig; appResolver: AppResolver };
  }>();

  mfeRouter.use("/", decorateStorage(storage));
  mfeRouter.use("*", decorateStorage(storage));

  mfeRouter.get("/", async (ctx) => {
    const resolver = ctx.get("appResolver");
    const appConfig = ctx.get("appConfig");
    const assetsMap = await resolver.getAssetMap();

    const appStream = await render(
      ctx.req,
      resolver.getServerUrl(),
      assetsMap,
      appConfig
    );

    logger.info(`MFE loaded: ${appConfig.id}`);

    return new Response(appStream, {
      headers: { "content-type": "text/html" },
    });
  });

  mfeRouter.get("/*", async (ctx, ...rest) => {
    const resolver = ctx.get("appResolver");

    const [_, mfeId, ...asset] = new URL(ctx.req.url).pathname.split("/");
    const assetPath = asset.join("/");

    const assetUrl = resolver.getAssetUrl(assetPath);

    logger.info(
      `Asset for MFE: ${mfeId} ${JSON.stringify({ assetPath, assetUrl })}`
    );

    // TODO check if assetUrl is relative path, if is, serve static, if is http then redirect
    if (assetUrl.startsWith("http")) {
      return Response.redirect(assetUrl);
    }
    const assetMiddleware = serveStatic({ path: assetUrl, root: "/" });

    const response = await assetMiddleware(ctx, ...rest);

    return response;
  });

  app.route("/:mfeId", mfeRouter);
}
