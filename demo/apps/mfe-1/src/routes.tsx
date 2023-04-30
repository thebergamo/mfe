import { HomePage, loader as homeLoader } from './pages/Home'
import { PostsPage } from './pages/Posts'

export const routes = [
  {
    path: '/',
    element: <HomePage />,
    loader: homeLoader,
  },
  {
    path: '/posts',
    element: <PostsPage />,
  },
]
