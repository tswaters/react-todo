

import React from 'react'
import {Module} from 'react-router-server'

export default (key, importer) => function Renderer (matchProps) {
  if (matchProps.staticContext && !matchProps.match.isExact) {
    matchProps.staticContext.status = 404
  }
  return (
    <Module key={key} module={importer}>
      {component => {
        if (!component) { return null }
        return <component.default {...matchProps} />
      }}
    </Module>
  )
}
