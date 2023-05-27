import {
  createStaticHandler,
  createStaticRouter,
  HonoRequest,
  importModule,
  ReactDOMServerReadableStream,
  renderToReadableStream,
  RouteObject,
  StaticRouterProvider,
  twind,
  twindSheets,
} from "../../deps.ts";
import { AppConfig } from "./apps-registry.ts";

export async function retrieveApp(appPath: string) {
  try {
    return await importModule(appPath);
  } catch (err) {
    console.log("IMPORT ERROR", err);
    throw err;
  }
}

const sheet = twindSheets.virtualSheet();
twind.setup({ sheet });

async function createRouterContext(req: HonoRequest, routes: RouteObject[]) {
  const handler = createStaticHandler(routes, { basename: "/mfe-1" });

  const context = await handler.query(req.raw);

  if ("ok" in context) {
    // in this case we have a response
    return { response: context };
  }

  const router = createStaticRouter(handler.dataRoutes, context);

  return {
    context,
    router,
  };
}
export async function render(
  req: HonoRequest,
  serverUrl: string,
  assetsMap: Record<string, string>,
  appConfig: AppConfig,
): Promise<ReactDOMServerReadableStream | Response> {
  console.log("trying to retrieve app");
  const { default: App, routes } = await retrieveApp(serverUrl);
  console.log("RETRIEVED APP");
  const mfeContext = {
    assetsMap: assetsMap,
    scripts: appConfig.artifacts.filter(
      (artifact) => artifact.endsWith("js") && artifact !== "index.js",
    ),
    styles: appConfig.artifacts.filter((artifact) => artifact.endsWith("css")),
    title: appConfig.name,
    menu: appConfig.navbar,
    id: appConfig.id,
    routerHydration: {},
  };

  const { context, router, response } = await createRouterContext(req, routes);

  if (response) {
    return response;
  }

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
