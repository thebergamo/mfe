import { AppConfig } from "./apps-registry.ts";
import { Hono, serveStatic } from "./deps.ts";
import { bootstrapJS, render, retrieveApp } from "./render.tsx";

/*
APIs to support:
- management api (manage new MFE)
- serve available MFE
- server static?
*/

const app = new Hono();

app.get("/", (c) => c.text("Hello MFE"));

app.get("/:mfeId", async () => {
  const appConfig: AppConfig = {
    id: "mfe-2",
    name: "MFE 2 - yo",
    path: "mfe-2",
    app: "examples/mfe-2/dist/server/entry-server.js",
    assetsMap: {
      "react.svg": "mfe-2/examples/mfe-2/dist/client/mfe-2/react.svg",
      "vite.svg": "mfe-2/examples/mfe-2/dist/client/mfe-2/vite.svg",
      "index.css": "mfe-2/examples/mfe-2/dist/client/mfe-2/index.css",
      "index.js": "mfe-2/examples/mfe-2/dist/client/assets/index-4b2b66a0.js"
    },
    artifacts: [
      "index.js",
      "index.css",
    ],
    navbar: [],
    proxy: [],
  };
  const appStream = await render(appConfig);

  return new Response(appStream, {
    headers: { "content-type": "text/html" },
  });
});

app.get("/:mfeId/*", (ctx, ...rest) => {
  const { mfeId } = ctx.req.param();
  const [_, _mfeId, ...asset] = new URL(ctx.req.url).pathname.split("/");
  const assetPath = asset.join("/");
  console.debug(assetPath);

  const r = serveStatic({ path: assetPath });

  return r(ctx, ...rest);
});

export async function startServer(serve: any) {
  await serve(app.fetch);
}
