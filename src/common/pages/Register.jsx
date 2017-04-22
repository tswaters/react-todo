
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {FormattedMessage, intlShape} from 'react-intl'
import {Helmet} from 'react-helmet'
import * as bootstrap from 'common/styles/bootstrap'
import classNames from 'classnames/bind'

import initialData from 'common/initial-data'
import FormInput from 'common/components/FormInput'
import {register} from 'common/redux/user'

const cx = classNames.bind(bootstrap)

@initialData({
  keys: [
    'register.title',
    'register.have-account',
    'auth.userName',
    'auth.password',
    'menu.register',
    'menu.login'
  ]
})
@connect()
class RegisterForm extends Component {

  static contextTypes = {
    intl: intlShape.isRequired
  }

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
    const title = this.context.intl.formatMessage({id: 'register.title'})
    return (
      <div>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <h2>{title}</h2>
        <form onSubmit={this.handleFormSubmit}>
          <FormInput
            label={this.context.intl.formatMessage({id: 'auth.userName'})}
            id="userName"
            value={this.state.userName}
            onChange={this.handleFieldChange('userName')}
          />
          <FormInput
            label={this.context.intl.formatMessage({id: 'auth.password'})}
            id="password"
            type="password"
            value={this.state.password}
            onChange={this.handleFieldChange('password')}
          />
          <button type="submit" className={cx('btn', 'btn-default')}>
            <FormattedMessage id="menu.register" />
          </button>
          <p className={cx('help-block')}>
            <FormattedMessage id="register.have-account" />
            <Link to="/auth/login">
              <FormattedMessage id="menu.login" />
            </Link>
          </p>
        </form>
      </div>
    )
  }
}

export default RegisterForm
