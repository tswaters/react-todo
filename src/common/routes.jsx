
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
          .catch(err => console.warn(err))
      }
    }, {
      path: 'todo',
      getComponent (nextState, cb) {
        System.import('./pages/Todo')
          .then(module => cb(null, module.default))
          .catch(err => console.warn(err))
      }
    }, {
      path: 'auth',
      childRoutes: [{
        path: 'login',
        getComponent (nextState, cb) {
          System.import('./pages/Login')
            .then(module => cb(null, module.default))
            .catch(err => console.warn(err))
        }
      }, {
        path: 'register',
        getComponent (nextState, cb) {
          System.import('./pages/Register')
            .then(module => cb(null, module.default))
            .catch(err => console.warn(err))
        }
      }]
    }]
  }, {
    path: '*',
    component: NotFound
  }]
}
