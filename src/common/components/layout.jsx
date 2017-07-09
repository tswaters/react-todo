
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Helmet} from 'react-helmet'

import Header from './header'
import Footer from './footer'
import Navbar from './navbar'
import cx from 'classnames'
import {container, alert, alertSuccess, alertDanger} from 'common/styles/bootstrap'

import {getRequestStats} from 'common/redux/api'

/**
 * @returns {string} layout of the application
 */
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
          <Header />
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
