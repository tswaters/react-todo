import {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {logout} from 'common/redux/user'

class LogoutPage extends PureComponent {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  UNSAFE_componentWillMount () {
    this.props.dispatch(logout())
  }

  render () {
    return null
  }
}

export default connect()(LogoutPage)
