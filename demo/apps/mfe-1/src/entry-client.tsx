// entry-client.tsx
import { MfeTemplate } from 'mfe-ui/comps'
import { MfeContext } from 'mfe-ui/dist/components/MfeTemplate'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'

declare global {
  interface Window {
    MfeContext: MfeContext
  }
}

let router = createBrowserRouter(routes, {
  basename: '/mfe-1',
  hydrationData: window.MfeContext.routerHydration,
})

ReactDOM.hydrateRoot(
  document,
  <MfeTemplate context={window.MfeContext}>
    <RouterProvider router={router} />
  </MfeTemplate>,
)

console.log('HIDRATED', window.MfeContext)
