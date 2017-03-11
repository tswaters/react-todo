
import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import classNames from 'classNames/bind'
import * as bootstrap from 'common/styles/bootstrap'

import FormInput from 'common/components/FormInput'
import {login} from 'common/actions'

const cx = classNames.bind(bootstrap)

class LoginForm extends Component {

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleFormSubmit = this.handleFormSubmit.bind(this)
  }

  state = {
    userName: '',
    password: ''
  }

  handleFieldChange (fieldName) {
    return event => this.setState({[fieldName]: event.target.value})
  }

  handleFormSubmit (event) {
    event.preventDefault()
    this.props.dispatch(login(this.state))
  }

  render () {
    return (
      <div>
        <h2>{'Login'}</h2>
        <form onSubmit={this.handleFormSubmit}>
          <FormInput
            label="Username"
            id="userName"
            value={this.state.userName}
            onChange={this.handleFieldChange('userName')}
          />
          <FormInput
            label="Password"
            id="password"
            type="password"
            value={this.state.password}
            onChange={this.handleFieldChange('password')}
          />
          <button type="submit" className={cx('btn', 'btn-default')}>
            {'Login'}
          </button>
          <p className={cx('help-block')}>
            {'No Account? '}
            <Link to="/auth/register">{'Register'}</Link>
          </p>
        </form>
      </div>
    )
  }
}

export default connect()(LoginForm)
