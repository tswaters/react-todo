import {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'
import {logout} from 'common/redux/user'

class LogoutPage extends PureComponent {

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  componentWillMount () {
    this.props.dispatch(logout())
    this.context.router.replace('/')
  }

  render () {
    return null
  }
}

export default connect()(LogoutPage)
