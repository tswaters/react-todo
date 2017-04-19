
import React, {PureComponent, PropTypes} from 'react'
import {withRouter} from 'react-router'
import {fetchState} from 'react-router-server'
import {intlShape} from 'react-intl'
import {getKeys} from 'common/redux/intl'

export default ({keys = [], promises = []} = {}) => Component => {

  const name = `${Component.displayName || Component.name}`

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
      [name]: false
    }

    static propTypes = {
      done: PropTypes.func.isRequired,
      [name]: PropTypes.bool.isRequired
    }

    componentWillMount () {
      if (this.props[name]) { return }
      const {store, intl} = this.context
      const {messages, locale} = intl
      const {dispatch} = store
      const needs = keys.filter(item => Object.keys(messages).indexOf(item) === -1)
      Promise.all(promises.map(promise => promise(dispatch)(this.props)))
        .then(() => dispatch(getKeys(locale, needs)))
        .then(() => this.props.done({[name]: true}))
        .catch(() => this.props.done({[name]: false}))
    }

    render () {
      if (!this.props[name]) { return null }
      return (
        <Component {...this.props} />
      )
    }
  }

  Loaded.displayName = `Loaded(${name})`
  Loaded.WrappedComponent = Component

  return Loaded
}
