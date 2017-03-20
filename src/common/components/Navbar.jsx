
import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
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

  constructor (props) {
    super(props)

    this.handleToggleClick = this.handleToggleClick.bind(this)
    this.state = {
      collapsed: false
    }
  }

  handleToggleClick () {
    this.setState({collapsed: !this.state.collapsed})
  }

  renderLink (link) {
    return React.cloneElement(link, {onClick: this.handleToggleClick})
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
        <li key="welcome">
          <span className={cx('navbar-text')}>
            <FormattedMessage id="auth-welcome" values={{name: this.props.user.userName}} />
          </span>
        </li>
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
      <nav className={cx('navbar', 'navbar-default', 'navbar-fixed-top')}>
        <div className={cx('container')}>
          <div className={cx('navbar-header')}>
            <a className={cx('navbar-brand')} onClick={this.handleToggleClick}>
              <FormattedMessage id="menu.brand" />
            </a>
            <button
              type="button"
              onClick={this.handleToggleClick}
              className={cx('navbar-toggle', 'collapsed')}
              aria-expanded={this.state.collapsed ? 'true' : 'false'}
              aria-controls="navbar"
            >
              <span className={cx('sr-only')}>
                <FormattedMessage id="toggle-navigation" />
              </span>
              <span className={cx('icon-bar')} />
              <span className={cx('icon-bar')} />
              <span className={cx('icon-bar')} />
            </button>
          </div>
          <div
            id="navbar"
            className={cx('navbar-collapse', 'collapse', {in: this.state.collapsed})}
            aria-expanded={this.state.collapsed ? 'true' : 'false'}
          >
            <ul className={cx('navbar-nav', 'nav')}>
              {leftNavs.map(link => this.renderLink(link))}
            </ul>
            <ul className={cx('nav', 'navbar-nav', 'navbar-right')}>
              {rightNavs.map(link => this.renderLink(link))}
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar
