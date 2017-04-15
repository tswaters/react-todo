
import React from 'react'
import {Switch, Route} from 'react-router'
import {Module} from 'react-router-server'

import Layout from './components/layout'

const renderer = importer => matchProps => {
  if (matchProps.staticContext && !matchProps.match.isExact) {
    matchProps.staticContext.status = 404
  }
  const render = component => {
    if (!component) { return null }
    return <component.default {...matchProps} />
  }
  return (
    <Module module={importer}>
      {render}
    </Module>
  )
}

const App = () => (
  <Layout>
    <Switch>
      <Route exact path="/" render={renderer(() => System.import('common/pages/Home'))} />
      <Route exact path="/todo" render={renderer(() => System.import('common/todo/Todo'))} />
      <Route exact path="/auth/register" render={renderer(() => System.import('common/pages/Register'))} />
      <Route exact path="/auth/login" render={renderer(() => System.import('common/pages/Login'))} />
      <Route exact path="/auth/logout" render={renderer(() => System.import('common/pages/Logout'))} />
      <Route exact path="/error" render={renderer(() => System.import('common/pages/Error'))} />
      <Route render={renderer(() => System.import('common/pages/NotFound'))} />
    </Switch>
  </Layout>
)

export default App
