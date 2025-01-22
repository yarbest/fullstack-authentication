import { lazy } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'

import LazyLoad from './LazyLoadComponent'
import NotFound from './NotFound'
import { paths } from './paths'
import PrivateRoute from './PrivateRoute'

const LoginPage = LazyLoad(lazy(() => import('../pages/LoginPage')))
const UsersPage = LazyLoad(lazy(() => import('../pages/UsersPage')))

const publicRoutes: RouteObject[] = [
  {
    path: paths.login,
    element: <LoginPage />,
  },
  {
    path: paths.notFound,
    element: <NotFound />,
  },
]

const privateRoutes: RouteObject[] = [
  {
    path: paths.users,
    element: (
      <PrivateRoute>
        <UsersPage />
      </PrivateRoute>
    ),
  },
  {
    path: paths.root,
    element: <Navigate to={paths.users} replace />,
  },
  {
    path: '*',
    element: <Navigate to={paths.notFound} replace />,
  },
]

export default function Router() {
  return useRoutes([...privateRoutes, ...publicRoutes])
}
