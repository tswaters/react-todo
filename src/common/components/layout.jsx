
import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import Header from './header'
import Footer from './footer'
import Navbar from './navbar'

import * as bootstrap from 'common/styles/bootstrap'

import {getRequestStats} from 'common/selectors/ajax'

const mapStateToProps = state => getRequestStats(state)

/**
 * @returns {string} layout of the application
 */
const Layout = ({children, requestInProgress, requestError}) =>
  <div>
    <div className={bootstrap.container}>
      <Navbar />
      <Header />
      {children}
      {requestInProgress ? '...' : ''}
      {requestError}
    </div>
    <Footer />
  </div>

Layout.defaultProps = {
  requestError: ''
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
  requestInProgress: PropTypes.bool.isRequired,
  requestError: PropTypes.string
}

export default connect(mapStateToProps)(Layout)
