
import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'

import FormInput from 'common/components/FormInput'
import {register} from 'common/actions'

class RegisterForm extends Component {

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
    this.props.dispatch(register(this.state))
  }

  render () {
    return (
      <div>
        <h2>{'Register'}</h2>
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
            {'Register'}
          </button>
        </form>
      </div>
    )
  }
}

export default connect()(RegisterForm)
