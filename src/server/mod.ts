import { ResolverFactory } from "./app-resolve-factory.ts";
import { AppConfig } from "./apps-registry.ts";
import { Hono, serveStatic } from "./deps.ts";
import { bootstrapJS, render, retrieveApp } from "./render.tsx";

/*
APIs to support:
- management api (manage new MFE)
- serve available MFE
- server static?
*/

const resolverFactory = new ResolverFactory();

const appConfig: AppConfig = {
  id: "mfe-2",
  name: "MFE 2 - yo",
  path: "mfe-2",
  app: "examples/mfe-2/dist/server/entry-server.js",
  artifacts: [
    "index.js",
    "index.css",
  ],
  resolver: {
    strategy: 'fs',
    strategyConfig: { baseDir: 'examples/mfe-2/dist/' }
  },
  navbar: [],
  proxy: [],
};

function getResolver(appConfig: AppConfig) {
  const { strategy, strategyConfig } = appConfig.resolver;
  return resolverFactory.getResolver(strategy, strategyConfig);
}

const app = new Hono();

app.get("/", (c) => c.text("Hello MFE"));

app.get("/:mfeId", async () => {
  const resolver = getResolver(appConfig);
  const assetsMap = await resolver.getAssetMap();

  const appStream = await render(resolver.getServerUrl(), assetsMap, appConfig);

  return new Response(appStream, {
    headers: { "content-type": "text/html" },
  });
});

app.get("/:mfeId/*", (ctx, ...rest) => {
  const { mfeId } = ctx.req.param();

  const resolver = getResolver(appConfig);

  const [_, _mfeId, ...asset] = new URL(ctx.req.url).pathname.split("/");
  const assetPath = asset.join("/");
  console.debug(assetPath);

  const assetUrl = resolver.getAssetUrl(assetPath);

  console.log(assetUrl);

  // TODO check if assetUrl is relative path, if is, serve static, if is http then redirect

  const r = serveStatic({ path: assetUrl, root: '/' });

  return r(ctx, ...rest);
});

export async function startServer(serve: any) {
  await serve(app.fetch);
}
