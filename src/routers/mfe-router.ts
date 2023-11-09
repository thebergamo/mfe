import {
  Hono,
  HonoContext,
  HonoRequest,
  HonoTypes,
  HTTPException,
  serveStatic,
} from "../../deps.ts";
import { ResolverFactory } from "../server/app-resolve-factory.ts";
import { AppResolver } from "../server/app-resolver.ts";
import { AppConfig } from "../server/apps-registry.ts";
import { AppOptions } from "../server/mod.ts";
import { render } from "../server/render.tsx";
import { ConsoleLogger } from "../utils/logger.ts";
import { decorateStorage } from "./storage.middleware.ts";

const logger = new ConsoleLogger("MfeRouter"); //getLogger("MfeRouter");

function getResolver(appConfig: AppConfig, runtime: HonoContext["runtime"]) {
  const { strategy, strategyConfig } = appConfig.resolver;
  return ResolverFactory.getResolver(
    strategy,
    strategyConfig,
    runtime,
    appConfig.id,
  );
}

const decorateMfe = () => async (ctx: HonoContext, next: HonoTypes.Next) => {
  const storage = ctx.get("storage");

  console.info("INCOMING", ctx.req.url);

  const { mfeId } = ctx.req.param() as { mfeId: string };
  console.log({ mfeId });
  try {
    const appConfig = await storage.get(mfeId);

    ctx.set("appConfig", appConfig);
    ctx.set("appResolver", getResolver(appConfig, ctx.runtime));
  } catch (err) {
    logger.error(err);
    if (err.message.includes("AppConfig not found")) {
      return ctx.notFound();
    }

    throw new HTTPException(500);
  }

  await next();
};

export function createMfeRouter<Env extends HonoTypes.Bindings>(
  app: Hono<{ Bindings: Env }>,
  { storageFactory }: AppOptions<Env>,
) {
  const mfeRouter = new Hono<{
    Variables: { appConfig: AppConfig; appResolver: AppResolver };
  }>({ strict: false });

  mfeRouter.use("/", decorateStorage<Env>(storageFactory), decorateMfe());
  mfeRouter.use("*", decorateStorage<Env>(storageFactory), decorateMfe());

  mfeRouter.get("/", mfeHandler);
  mfeRouter.get("/*", mfeHandler);

  app.route("/:mfeId", mfeRouter);
}

function cleanPrefix([_prefix, ...asset]: string[]) {
  return asset.join("/");
}

const mfeHandler = async (ctx: HonoContext, next: HonoTypes.Next) => {
  try {
    const resolver = ctx.get("appResolver");
    const appConfig = ctx.get("appConfig");
    const assetsMap = await resolver.getAssetMap();

    console.info(`App loaded... ${JSON.stringify(appConfig, null, 4)}`);
    const [_, mfeId, ...asset] = new URL(ctx.req.url).pathname.split("/");
    const assetPath = asset[0] === mfeId ? cleanPrefix(asset) : asset.join("/");

    const isAssetUrl = Object.entries(assetsMap).find(
      ([_key, asset]) => asset === `${mfeId}/${assetPath}`,
    );

    logger.debug(`Is asset url? ${Boolean(isAssetUrl)} - ${assetPath}`);
    if (isAssetUrl) {
      return loadAssets(ctx, next, { resolver, assetPath, mfeId });
    }

    // load mfe
    return loadMfe({ req: ctx.req, resolver, assetsMap, appConfig });
  } catch (err) {
    console.log("SOmething wen't wrong", err);
    logger.error(err);
  }
};

interface LoadMfeArgs {
  req: HonoRequest;
  resolver: AppResolver;
  // deno-lint-ignore no-explicit-any
  assetsMap: any;
  appConfig: AppConfig;
}
const loadMfe = async ({
  req,
  resolver,
  assetsMap,
  appConfig,
}: LoadMfeArgs) => {
  try {
    const appStream = await render(
      req,
      resolver,
      assetsMap,
      appConfig,
    );

    if ("ok" in appStream) {
      logger.warn("Response returned instead of app");

      return appStream;
    }

    logger.info(`MFE loaded: ${appConfig.id}`);

    return new Response(appStream, {
      headers: { "content-type": "text/html" },
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

interface LoadAssetsArgs {
  resolver: AppResolver;
  assetPath: string;
  mfeId: string;
}
const loadAssets = async (
  ctx: HonoContext,
  next: HonoTypes.Next,
  { resolver, assetPath, mfeId }: LoadAssetsArgs,
) => {
  const assetUrl = resolver.getAssetUrl(assetPath);

  logger.info(
    `Asset for MFE: ${mfeId} ${JSON.stringify({ assetPath, assetUrl })}`,
  );

  // TODO check if assetUrl is relative path, if is, serve static, if is http then redirect
  if (assetUrl.startsWith("http")) {
    return Response.redirect(assetUrl);
  }
  const assetMiddleware = serveStatic({ path: assetUrl, root: "/" });

  const response = await assetMiddleware(ctx, next);

  return response;
};
