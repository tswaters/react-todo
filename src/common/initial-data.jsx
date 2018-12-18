
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'
import {fetchState} from 'react-router-server'
import {intlShape} from 'react-intl'
import {getKeys} from 'common/redux/intl'

export default ({keys = [], promises = []} = {}) => Component => {

  const name = `${Component.displayName || Component.name}`

  class Loaded extends PureComponent {

    static contextTypes = {
      intl: intlShape.isRequired,
      store: PropTypes.object.isRequired
    }

    static defaultProps = {
      isDone: false
    }

    static propTypes = {
      done: PropTypes.func.isRequired,
      isDone: PropTypes.bool
    }

    UNSAEF_componentWillMount () {
      if (this.props.isDone) {
        return
      }

      const {store, intl} = this.context
      const {messages, locale} = intl
      const {dispatch} = store
      const needs = keys.filter(item => Object.keys(messages).indexOf(item) === -1)
      Promise.all(promises.map(promise => promise(dispatch)(this.props)))
        .then(() => dispatch(getKeys(locale, needs)))
        .then(() => this.props.done({isDone: true}))
        .catch(() => this.props.done({isDone: false}))
    }

    render () {
      if (!this.props.isDone) { return null }
      return (
        <Component {...this.props} />
      )
    }
  }

  Loaded.displayName = `Loaded(${name})`
  Loaded.WrappedComponent = Component

  return withRouter(fetchState(state => state, actions => ({done: actions.done}))(Loaded))
}
