import {matchRoutes} from 'react-router-config'

export const loadRoutes = (config, location) => Promise.all(
  matchRoutes(config, location).map(match => {
    const {component} = match.route
    if (component && component.component) {
      return component.component
    }
    return null
  })
)

export const loadActions = (config, location) =>
  matchRoutes(config, location).reduce((memo, match) => {
    const {component} = match.route
    if (component && component.actions) {
      return [...memo, ...component.actions]
    }
    return memo
  }, [])

// todo: this isnt full route object; populate if we need more
export const getRoute = (config, location) => {
  const routes = matchRoutes(config, location)

  const params = routes.reduce((memo, item) => {
    if (!item.match || !item.match.params) { return memo }
    return {...memo, ...item.match.params}
  }, {})

  return {params}
}
