
import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import classNames from 'classnames/bind'
import * as bootstrap from 'common/styles/bootstrap'

import NavLink from './NavLink'

const cx = classNames.bind(bootstrap)

/**
 * @returns {string} Navbar for the application
 */
const Navbar = ({user}) => {
  const navs = []
  if (user) {
    navs.push(
      <NavLink key="todo" activeClassName={cx('active')} to="/todo">
        {'Todos'}
      </NavLink>
    )
    navs.push(
      <NavLink key="logout" activeClassName={cx('active')} to="/auth/logout">
        {'Logout'}
      </NavLink>
    )
  } else {
    navs.push(
      <NavLink key="register" activeClassName={cx('active')} to="/auth/register">
        {'Register'}
      </NavLink>
    )
    navs.push(
      <NavLink key="login" activeClassName={cx('active')} to="/auth/login">
        {'Login'}
      </NavLink>
    )
  }
  return (
    <nav className={cx('navbar', 'navbar-default')}>
      <div className={cx('container')}>
        <div className={cx('navbar-header')}>
          <Link className={cx('navbar-brand')} activeClassName={cx('active')} to="/">
            {'Todo'}
          </Link>
        </div>
        <ul className={cx('navbar-nav', 'nav')}>
          {navs}
        </ul>
      </div>
    </nav>
  )
}

Navbar.defaultProps = {
  user: null
}

Navbar.propTypes = {
  user: PropTypes.shape({
    userName: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired
  })
}

const mapStateToProps = state => ({user: state.user})

export default connect(mapStateToProps)(Navbar)
