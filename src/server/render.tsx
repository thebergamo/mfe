import React from "react";
import {
  ReactDOMServerReadableStream,
  renderToReadableStream,
  renderToString,
} from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from "react-router-dom/server";
import * as twind from "twind";
import * as twindSheets from "twind/sheets";
import { AppConfig } from "./apps-registry.ts";

export function retrieveApp(appPath: string) {
  return import(appPath);
}

const sheet = twindSheets.virtualSheet();
twind.setup({ sheet });

function extractCss(App) {
  sheet.reset();

  const body = renderToString(App);

  const styleTag = twindSheets.getStyleTag(sheet);

  return styleTag;
}

async function createRouterContext(req, routes) {
  let handler = createStaticHandler(routes, { basename: "/mfe-1" });

  let context = await handler.query(req);
  let router = createStaticRouter(handler.dataRoutes, context);

  return {
    context,
    router,
  };
}
export async function render(
  req,
  serverUrl: string,
  assetsMap: Record<string, string>,
  appConfig: AppConfig
  // @ts-ignore
): Promise<ReactDOMServerReadableStream> {
  const { default: App, routes } = await retrieveApp(serverUrl);
  const mfeContext = {
    assetsMap: assetsMap,
    scripts: appConfig.artifacts.filter(
      (artifact) => artifact.endsWith("js") && artifact !== "index.js"
    ),
    styles: appConfig.artifacts.filter((artifact) => artifact.endsWith("css")),
    title: appConfig.name,
    id: appConfig.id,
    routerHydration: {},
  };

  const { context, router } = await createRouterContext(req, routes);

  console.log({ context });
  mfeContext.routerHydration = {
    loaderData: context.loaderData,
  };

  const AppToRender = (
    <App context={mfeContext}>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </App>
  );

  const stream = await renderToReadableStream(AppToRender, {
    bootstrapScriptContent: `window.MfeContext = ${JSON.stringify(mfeContext)}`,
    bootstrapModules: [assetsMap[appConfig.artifacts[0]]],
  });

  return stream;
}
