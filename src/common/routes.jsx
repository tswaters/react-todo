
import Layout from './components/layout'
import NotFound from './pages/NotFound'

export default {
  childRoutes: [{
    component: Layout,
    childRoutes: [{
      path: '/',
      getComponent (nextState, cb) {
        System.import('./pages/Home')
          .then(module => cb(null, module.default))
          .catch(err => cb(err))
      }
    }, {
      path: 'todo',
      getComponent (nextState, cb) {
        System.import('./todo/Todo')
          .then(module => cb(null, module.default))
          .catch(err => cb(err))
      }
    }, {
      path: 'auth',
      childRoutes: [{
        path: 'logout',
        getComponent (nextState, cb) {
          System.import('./pages/Logout')
            .then(module => cb(null, module.default))
            .catch(err => cb(err))
        }
      }, {
        path: 'login',
        getComponent (nextState, cb) {
          System.import('./pages/Login')
            .then(module => cb(null, module.default))
            .catch(err => cb(err))
        }
      }, {
        path: 'register',
        getComponent (nextState, cb) {
          System.import('./pages/Register')
            .then(module => cb(null, module.default))
            .catch(err => cb(err))
        }
      }]
    }]
  }, {
    path: '*',
    component: NotFound
  }]
}
