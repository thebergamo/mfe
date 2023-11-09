import { renderToReadableStream } from 'react-dom/server'
import { StaticRouterProvider } from 'react-router-dom/server'
import { MfeTemplate } from 'mfe-ui/comps'
import type { MfeContext } from 'mfe-ui/dist/components/MfeTemplate'

export { routes } from './routes'

function MfeServer(props: { context: MfeContext; children: React.ReactNode }) {
  return <MfeTemplate context={props.context}>{props.children}</MfeTemplate>
}

export default function renderApp({
  mfeContext,
  router,
  context,
  bootstrapScript,
}: any) {
  const AppToRender = (
    <MfeServer context={mfeContext}>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </MfeServer>
  )

  return renderToReadableStream(AppToRender, {
    bootstrapScriptContent: `window.MfeContext = ${JSON.stringify(mfeContext)}`,
    bootstrapModules: [bootstrapScript],
  })
}
