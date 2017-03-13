
import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {FormattedMessage} from 'react-intl'
import classNames from 'classnames/bind'
import * as bootstrap from 'common/styles/bootstrap'

import {getUser} from 'common/redux/user'
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
    const leftNavs = []
    const rightNavs = []
    if (this.props.user) {
      leftNavs.push(
        <NavLink key="todo" activeClassName={cx('active')} to="/todo">
          <FormattedMessage id="menu.todo" />
        </NavLink>
      )
      rightNavs.push(
        <NavLink key="logout" activeClassName={cx('active')} to="/auth/logout">
          <FormattedMessage id="menu.logout" />
        </NavLink>
      )
      rightNavs.push(
        <p key="welcome" className={cx('navbar-text')}>
          <FormattedMessage id="auth-welcome" values={{name: this.props.user.userName}} />
        </p>
      )
    } else {
      rightNavs.push(
        <NavLink key="register" activeClassName={cx('active')} to="/auth/register">
          <FormattedMessage id="menu.register" />
        </NavLink>
      )
      rightNavs.push(
        <NavLink key="login" activeClassName={cx('active')} to="/auth/login">
          <FormattedMessage id="menu.login" />
        </NavLink>
      )
    }
    return (
      <nav className={cx('navbar', 'navbar-default')}>
        <div className={cx('container-fluid')}>
          <div className={cx('navbar-header')}>
            <Link className={cx('navbar-brand')} activeClassName={cx('active')} to="/">
              <FormattedMessage id="menu.brand" />
            </Link>
          </div>
          <ul className={cx('navbar-nav', 'nav')}>
            {leftNavs}
          </ul>
          <ul className={cx('nav', 'navbar-nav', 'navbar-right')}>
            {rightNavs}
          </ul>
        </div>
      </nav>
    )
  }
}

export default Navbar
