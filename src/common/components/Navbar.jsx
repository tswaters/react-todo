
import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'
import classNames from 'classnames/bind'
import * as bootstrap from 'common/styles/bootstrap'

import {getUser} from 'common/selectors/user'
import NavLink from './NavLink'

const cx = classNames.bind(bootstrap)

/**
 * @returns {string} Navbar for the application
 */

@connect(state => getUser(state))
class Navbar extends PureComponent {

  static propTypes = {
    user: PropTypes.shape({
      userName: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    })
  }

  static defaultProps = {
    user: null
  }

  render () {
    const navs = []
    if (this.props.user) {
      navs.push(
        <NavLink key="todo" activeClassName={cx('active')} to="/todo">
          <FormattedMessage id="menu.todo" />
        </NavLink>
      )
      navs.push(
        <NavLink key="logout" activeClassName={cx('active')} to="/auth/logout">
          <FormattedMessage id="menu.logout" />
        </NavLink>
      )
    } else {
      navs.push(
        <NavLink key="register" activeClassName={cx('active')} to="/auth/register">
          <FormattedMessage id="menu.register" />
        </NavLink>
      )
      navs.push(
        <NavLink key="login" activeClassName={cx('active')} to="/auth/login">
          <FormattedMessage id="menu.login" />
        </NavLink>
      )
    }
    return (
      <nav className={cx('navbar', 'navbar-default')}>
        <div className={cx('container')}>
          <div className={cx('navbar-header')}>
            <Link className={cx('navbar-brand')} activeClassName={cx('active')} to="/">
              <FormattedMessage id="menu.brand" />
            </Link>
          </div>
          <ul className={cx('navbar-nav', 'nav')}>
            {navs}
          </ul>
        </div>
      </nav>
    )
  }
}

export default Navbar
