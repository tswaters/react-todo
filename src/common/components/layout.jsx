
import React, {PropTypes, PureComponent} from 'react'
import {connect} from 'react-redux'
import {Helmet} from 'react-helmet'

import Header from './header'
import Footer from './footer'
import Navbar from './navbar'
import classNames from 'classnames/bind'
import * as bootstrap from 'common/styles/bootstrap'
const cx = classNames.bind(bootstrap)

import {getRequestStats} from 'common/redux/api'

/**
 * @returns {string} layout of the application
 */
@connect(state => getRequestStats(state))
class Layout extends PureComponent {

  static defaultProps = {
    requestError: null
  }

  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ]).isRequired,
    requestInProgress: PropTypes.bool.isRequired,
    requestError: PropTypes.object
  }

  render () {
    const errorFlash = this.props.requestError ? (
      <div className={cx('alert', 'alert-danger')}>
        {this.props.requestError.message}
      </div>
     ) : null

    return (
      <div>
        <Helmet titleTemplate="%s | Todo" defaultTitle="Todo" />
        <div className={bootstrap.container}>
          <Navbar />
          <Header />
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
