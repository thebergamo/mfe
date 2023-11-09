import {
  createStaticHandler,
  createStaticRouter,
  HonoRequest,
  ReactDOMServerReadableStream,
  renderToReadableStream,
  RouteObject,
  StaticRouterProvider,
  twind,
  twindSheets,
} from "../../deps.ts";
import { AppResolver } from "./app-resolver.ts";
import { AppConfig } from "./apps-registry.ts";

const sheet = twindSheets.virtualSheet();
twind.setup({ sheet });

async function createRouterContext(
  req: HonoRequest,
  appId: string,
  routes: RouteObject[],
) {
  // @ts-ignore
  const handler = createStaticHandler(routes, { basename: `/${appId}` });

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
  resolver: AppResolver,
  assetsMap: Record<string, string>,
  appConfig: AppConfig,
): Promise<ReactDOMServerReadableStream | Response> {
  const { renderApp, routes } = await resolver.getServerEntry();
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

  const { context, router, response } = await createRouterContext(
    req,
    appConfig.id,
    routes,
  );

  if (response) {
    return response;
  }

  mfeContext.routerHydration = {
    loaderData: context.loaderData,
  };

  const stream = await renderApp({
    mfeContext,
    //@ts-ignore
    router,
    //@ts-ignore
    context,
    bootstrapScript: assetsMap[appConfig.artifacts[0]],
  });

  return stream;
}
