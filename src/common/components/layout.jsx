
import React, {PropTypes, PureComponent} from 'react'
import {connect} from 'react-redux'
import Header from './header'
import Footer from './footer'
import Navbar from './navbar'

import * as bootstrap from 'common/styles/bootstrap'

import {getRequestStats} from 'common/redux/api'

/**
 * @returns {string} layout of the application
 */
@connect(state => getRequestStats(state))
class Layout extends PureComponent {

  static defaultProps = {
    requestError: ''
  }

  static propTypes = {
    children: PropTypes.element.isRequired,
    requestInProgress: PropTypes.bool.isRequired,
    requestError: PropTypes.string
  }

  render () {
    return (
      <div>
        <div className={bootstrap.container}>
          <Navbar />
          <Header />
          {this.props.children}
          {this.props.requestInProgress ? '...' : ''}
          {this.props.requestError}
        </div>
        <Footer />
      </div>
    )
  }
}

export default Layout
