
import AsyncRoute from './AsyncRoute'
import App from 'common/components/layout'
import NotFound from 'common/pages/NotFound'
import {fetchProfile} from '../redux/profile'
import {fetchTodos} from '../redux/todo'
import {logout} from '../redux/user'

export default [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: AsyncRoute({
          loader: () => import('common/pages/Home'),
          actions: []
        })
      },
      {
        path: '/todo',
        exact: true,
        component: AsyncRoute({
          loader: () => import('common/todo/Todo'),
          actions: [
            () => fetchTodos()
          ]
        })
      },
      {
        path: '/auth/register',
        exact: true,
        component: AsyncRoute({
          loader: () => import('common/pages/Register'),
          actions: []
        })
      },
      {
        path: '/auth/login',
        exact: true,
        component: AsyncRoute({
          loader: () => import('common/pages/Login'),
          actions: []
        })
      },
      {
        path: '/auth/profile',
        exact: true,
        component: AsyncRoute({
          loader: () => import('common/profile/Profile'),
          actions: [
            () => fetchProfile()
          ]
        })
      },
      {
        path: '/auth/logout',
        exact: true,
        component: AsyncRoute({
          loader: () => import('common/pages/Logout'),
          actions: [
            () => logout()
          ]
        })
      },
      {
        path: 'error',
        status: 404,
        component: AsyncRoute({
          loader: () => import('common/pages/Error'),
          actions: []
        })
      },
      {
        path: '*',
        status: 404,
        component: NotFound
      }
    ]
  }
]
