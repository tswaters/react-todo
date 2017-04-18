
import React, {PureComponent, PropTypes} from 'react'
import {withRouter} from 'react-router'
import {fetchState} from 'react-router-server'
import {intlShape} from 'react-intl'
import {getKeys} from 'common/redux/intl'

export default ({keys = [], promises = []} = {}) => Component => {

  @withRouter
  @fetchState(
    state => state,
    actions => ({done: actions.done})
  )
  class Loaded extends PureComponent {

    static contextTypes = {
      intl: intlShape.isRequired,
      store: PropTypes.object.isRequired
    }

    static defaultProps = {
      ready: false
    }

    static propTypes = {
      done: PropTypes.func.isRequired,
      ready: PropTypes.bool.isRequired
    }

    componentWillMount () {
      const {store, intl} = this.context
      const {messages, locale} = intl
      const {dispatch} = store
      const needs = keys.filter(item => Object.keys(messages).indexOf(item) === -1)
      Promise.all(promises.map(promise => promise(dispatch)(this.props)))
        .then(() => dispatch(getKeys(locale, needs)))
        .then(() => this.props.done({ready: true}))
    }

    render () {
      if (!this.props.ready) { return null }
      return (
        <Component {...this.props} />
      )
    }
  }

  Loaded.displayName = `Loaded(${Component.displayName || Component.name})`
  Loaded.WrappedComponent = Component

  return Loaded
}
