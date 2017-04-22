import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {Route, Link} from 'react-router-dom'

class NavLink extends PureComponent {

  static contextTypes = {
    router: PropTypes.object
  }

  static defaultProps = {
    exact: true,
    strict: true
  }

  static propTypes = {
    activeClassName: PropTypes.string.isRequired,
    exact: PropTypes.bool,
    strict: PropTypes.bool,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]).isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  }

  render () {

    const {
      to,
      exact,
      strict,
      activeClassName,
      ...rest
    } = this.props

    return (
      <Route path={to} exact={exact} strict={strict} children={({match}) => (
        <li className={match ? activeClassName : null} {...rest}>
          <Link to={to}>{this.props.children}</Link>
        </li>
      )}
      />
    )
  }
}

export default NavLink
