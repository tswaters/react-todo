
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import FormInput from 'common/components/FormInput'
import {login} from 'common/actions'

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
          <button type="submit">
            {'Login'}
          </button>
        </form>
      </div>
    )
  }
}

export default connect()(LoginForm)
