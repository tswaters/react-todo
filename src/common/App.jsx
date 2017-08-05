
import React from 'react'
import {Switch} from 'react-router'
import Layout from './components/layout'
import asyncRoute from './util/asyncRoute'

const App = () => (
  <Layout>
    <Switch>
      {asyncRoute('/', () => System.import('common/pages/Home'))}
      {asyncRoute('/todo', () => System.import('common/todo/Todo'))}
      {asyncRoute('/auth/register', () => System.import('common/pages/Register'))}
      {asyncRoute('/auth/profile', () => System.import('common/profile/Profile'))}
      {asyncRoute('/auth/login', () => System.import('common/pages/Login'))}
      {asyncRoute('/auth/logout', () => System.import('common/pages/Logout'))}
      {asyncRoute('/error', () => System.import('common/pages/Error'))}
      {asyncRoute(null, () => System.import('common/pages/NotFound'))}
    </Switch>
  </Layout>
)

export default App
