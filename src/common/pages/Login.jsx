
import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router-dom'
import {FormattedMessage, intlShape} from 'react-intl'
import {connect} from 'react-redux'
import {Helmet} from 'react-helmet'
import classNames from 'classnames/bind'
import * as bootstrap from 'common/styles/bootstrap'

import FormInput from 'common/components/FormInput'
import {login} from 'common/redux/user'

const cx = classNames.bind(bootstrap)

class LoginForm extends Component {

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
    this.props.dispatch(login(this.state))
  }

  render () {
    const title = this.context.intl.formatMessage({id: 'login.title'})
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
            <FormattedMessage id="menu.login" />
          </button>
          <p className={cx('help-block')}>
            <FormattedMessage id="login.no-account" />
            <Link to="/auth/register">
              <FormattedMessage id="menu.register" />
            </Link>
          </p>
        </form>
      </div>
    )
  }
}

export default connect()(LoginForm)
