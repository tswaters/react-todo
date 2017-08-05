
import React from 'react'
import {Route} from 'react-router'
import renderer from './renderer'

export default function AsyncRoute (path, loader) {
  const routeProps = {
    render: renderer(path, loader),
    exact: true
  }
  if (path) {
    routeProps.path = path
  }
  return (
    <Route {...routeProps} />
  )
}
