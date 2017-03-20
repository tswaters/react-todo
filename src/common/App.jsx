
import React from 'react'
import {Route} from 'react-router'
import {Module} from 'react-router-server'

import Layout from './components/layout'

const renderer = importer => matchProps => {
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
    <Route exact path="/" render={renderer(() => System.import('common/pages/Home'))} />
    <Route exact path="/todo" render={renderer(() => System.import('common/todo/Todo'))} />
    <Route exact path="/auth/register" render={renderer(() => System.import('common/pages/Register'))} />
    <Route exact path="/auth/login" render={renderer(() => System.import('common/pages/Login'))} />
    <Route exact path="/auth/logout" render={renderer(() => System.import('common/pages/Logout'))} />
  </Layout>
)

export default App
