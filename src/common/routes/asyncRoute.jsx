
import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {withRouter} from 'react-router'

export default function ({loader, actions = [], Placeholder}) {

  if (!loader) {
    throw new Error('loader required!')
  }

  let Component = null

  class AsyncComponent extends React.PureComponent {

    static defaultProps = {
      loaded: false
    }

    static propTypes = {
      loaded: PropTypes.bool,
      dispatch: PropTypes.func.isRequired,
      match: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired
    }

    static get component () {
      return loader().then(component => Component = component.default || component)
    }

    static get actions () {
      return actions
    }

    constructor (props) {
      super(props)
      this.update = this.update.bind(this)
      this.state = {Component, loaded: props.loaded}
      this.mounted = false
    }

    // todo - maybe r17 makes this less of a pain to get going
    UNSAFE_componentWillMount () {
      AsyncComponent.component.then(this.update)
    }

    componentDidMount () {

      this.mounted = true

      // if we already loaded from server context, ignore.
      if (this.props.loaded) { return }

      this.load()
        .then(() => this.mounted && this.setState({loaded: true}))
        .catch(error => this.mounted && this.setState({error}))
    }

    componentDidUpdate (prevProps) {
      if (this.props.loaded !== prevProps.loaded) {
        this.setState({loaded: this.props.loaded})
      }
    }

    componentWillUnmount () {
      this.mounted = false
    }

    update () {
      if (this.state.Component !== Component) {
        this.setState({Component})
      }
    }

    load () {
      const {match} = this.props
      return Promise.all(actions.map(action => this.props.dispatch(action(match))))
    }

    render () {
      const {Component: ComponentFromState} = this.state

      if (!this.state.loaded) {
        return <p>SPINNER!</p>
      }

      if (ComponentFromState) {
        return <ComponentFromState {...this.props} />
      }

      if (Placeholder) {
        return <Placeholder {...this.props} />
      }

      return null
    }

  }

  return withRouter(connect()(AsyncComponent))

}
