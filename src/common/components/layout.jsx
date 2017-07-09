
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Helmet} from 'react-helmet'
import {FormattedMessage} from 'react-intl'

import initialData from 'common/initial-data'
import Footer from './footer'
import Navbar from './navbar'
import cx from 'classnames'
import {container, srOnly, alert, alertSuccess, alertDanger} from 'common/styles/bootstrap'

import {getRequestStats} from 'common/redux/api'

/**
 * @returns {string} layout of the application
 */
@initialData({
  keys: [
    'application-name'
  ]
})
@connect(state => getRequestStats(state))
class Layout extends PureComponent {

  static defaultProps = {
    requestError: null,
    requestInfo: null
  }

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    requestInProgress: PropTypes.bool.isRequired,
    requestError: PropTypes.object,
    requestInfo: PropTypes.object
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
          {this.props.children}
          {this.props.requestInProgress ? '...' : ''}
        </div>
        <Footer />
      </div>
    )
  }
}

export default Layout
