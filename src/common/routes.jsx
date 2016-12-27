/* eslint react/jsx-max-props-per-line: 0 */

import React from 'react'
import {Route} from 'react-router'

import Layout from './components/layout'
import {Todo, NotFound} from './pages'

const Routes = (
  <Route component={Layout}>
    <Route path="/" component={Todo} />
    <Route path="*" component={NotFound} />
  </Route>
)

export default Routes
