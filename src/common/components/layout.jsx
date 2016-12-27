
import React, {PropTypes} from 'react'
import Header from './header'
import Footer from './footer'

/**
 * @returns {string} layout of the application
 */
const Layout = ({children}) =>
  <div id="container">
    <Header />
    {children}
    <Footer />
  </div>

Layout.propTypes = {
  children: PropTypes.element.isRequired
}

export default Layout
