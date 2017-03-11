import React, {PureComponent, PropTypes} from 'react'
import {Link, IndexLink, withRouter} from 'react-router'

import classNames from 'classnames'

class NavLink extends PureComponent {

  static contextTypes = {
    router: React.PropTypes.object
  }

  static defaultProps = {
    index: false,
    onlyActiveOnIndex: false
  }

  static propTypes = {
    activeClassName: PropTypes.string.isRequired,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]).isRequired,
    onlyActiveOnIndex: PropTypes.bool,
    index: PropTypes.bool,
    children: PropTypes.string.isRequired
  }

  render () {
    const {router} = this.context
    const {activeClassName, index, onlyActiveOnIndex, to, children} = this.props

    const isActive = router.isActive(to, onlyActiveOnIndex)
    const LinkComponent = index ? IndexLink : Link

    return (
      <li className={classNames({[activeClassName]: isActive})}>
        <LinkComponent to={to}>{children}</LinkComponent>
      </li>
    )
  }
}

export default withRouter(NavLink)
