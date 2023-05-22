import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'

let router = createBrowserRouter(routes, { basename: '/mfe-1' })
function App() {
  return <RouterProvider router={router} />
}

export default App
