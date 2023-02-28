import React from "react";
import {
  ReactDOMServerReadableStream,
  renderToReadableStream,
} from "react-dom/server";
import { AppConfig } from "./apps-registry.ts";

type TemplateProps = {
  Mfe: React.ReactNode,
  mfeId: string,
  scripts?: string[],
  styles?: string[],
  title?: string
}

export async function retrieveApp(appPath: string) {
  //TODO: Remove this later on and resolve inside the AppRegistry
  const path = `../../${appPath}`;
  return import(path);
}

export async function bootstrapJS(mfeId: string) {
  return retrieveApp(mfeId)
}

export async function render(
  appConfig: AppConfig
): Promise<ReactDOMServerReadableStream> {
  const { default: App } = await retrieveApp(appConfig.app);
  const mfeContext = {
    assetsMap: appConfig.assetsMap,
    scripts: appConfig.artifacts.filter((artifact) => artifact.endsWith('js') && artifact !== 'index.js'),
    styles: appConfig.artifacts.filter((artifact) => artifact.endsWith('css')), 
    title: appConfig.name,
  }

  const stream = await renderToReadableStream(<App context={mfeContext} />, {
    bootstrapScriptContent: `window.MfeContext = ${JSON.stringify(mfeContext)}`,
    bootstrapModules: [appConfig.assetsMap[appConfig.artifacts[0]]],
  });

  return stream;
}
