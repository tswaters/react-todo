
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Helmet} from 'react-helmet'
import {FormattedMessage} from 'react-intl'
import {withRouter} from 'react-router'
import {renderRoutes} from 'react-router-config'

import Footer from 'common/components/footer'
import Navbar from 'common/components/navbar'
import cx from 'classnames'
import {container, srOnly, alert, alertSuccess, alertDanger} from 'common/styles/bootstrap'

import {getRequestStats} from 'common/redux/api'

@withRouter
@connect(state => getRequestStats(state))
class Layout extends Component {

  static defaultProps = {
    requestError: null,
    requestInfo: null
  }

  static propTypes = {
    loaded: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    requestInProgress: PropTypes.bool.isRequired,
    requestError: PropTypes.object,
    requestInfo: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = {
      loaded: props.loaded
    }
  }

  /**
   * When path changes, make sure to reset loaded to FALSE so child component (asyncRoute) knows to reload.
   */
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.setState({loaded: false})
    }
  }

  render () {
    const infoFlash = this.props.requestInfo ? (
      <div className={cx(alert, alertSuccess)}>
        {this.props.requestInfo.message}
      </div>
    ) : null

    const errorFlash = this.props.requestError ? (
      <div className={cx(alert, alertDanger)}>
        {this.props.requestError.message}
      </div>
    ) : null

    return (
      <div>
        <Helmet titleTemplate="%s | Todo" defaultTitle="Todo" />
        <div className={cx(container)}>
          <Navbar />
          <h1 className={srOnly}>
            <FormattedMessage id="application-name" />
          </h1>
          {infoFlash}
          {errorFlash}
          {renderRoutes(this.props.route.routes, {loaded: this.state.loaded})}
          {this.props.requestInProgress ? '...' : ''}
        </div>
        <Footer />
      </div>
    )
  }
}

export default Layout
