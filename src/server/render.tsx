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
  return import(appPath);
}

export async function bootstrapJS(mfeId: string) {
  return retrieveApp(mfeId)
}

export async function render(
  serverUrl: string,
  assetsMap: Record<string, string>,
  appConfig: AppConfig
): Promise<ReactDOMServerReadableStream> {
  const { default: App } = await retrieveApp(serverUrl);
  const mfeContext = {
    assetsMap: assetsMap,
    scripts: appConfig.artifacts.filter((artifact) => artifact.endsWith('js') && artifact !== 'index.js'),
    styles: appConfig.artifacts.filter((artifact) => artifact.endsWith('css')), 
    title: appConfig.name,
  }

  const stream = await renderToReadableStream(<App context={mfeContext} />, {
    bootstrapScriptContent: `window.MfeContext = ${JSON.stringify(mfeContext)}`,
    bootstrapModules: [assetsMap[appConfig.artifacts[0]]],
  });

  return stream;
}
