
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {FormattedMessage, intlShape} from 'react-intl'
import {connect} from 'react-redux'
import {Helmet} from 'react-helmet'
import cx from 'classnames'
import {faUser, faLock} from 'common/styles/font-awesome'
import {
  panel,
  panelHeading,
  panelTitle,
  panelDefault,
  panelBody,
  row,
  colXs12,
  colSm6,
  colSmOffset3,
  pullRight,
  btn,
  btnDefault,
  helpBlock
} from 'common/styles/bootstrap'

import Form from 'common/components/Form'
import FormInput from 'common/components/FormInput'
import {login} from 'common/redux/user'

@connect()
class LoginForm extends PureComponent {

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
      <div className={row}>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <div className={cx(colXs12, colSm6, colSmOffset3)}>
          <div className={cx(panel, panelDefault)}>
            <div className={cx(panelHeading)}>
              <h2 className={cx(panelTitle)}>{title}</h2>
            </div>
            <Form className={cx(panelBody)} onSubmit={this.handleFormSubmit}>
              <FormInput
                icon={faUser}
                placeholder={this.context.intl.formatMessage({id: 'auth.userName'})}
                required
                id="userName"
                value={this.state.userName}
                onChange={this.handleFieldChange('userName')}
              />
              <FormInput
                icon={faLock}
                placeholder={this.context.intl.formatMessage({id: 'auth.password'})}
                required
                id="password"
                type="password"
                value={this.state.password}
                onChange={this.handleFieldChange('password')}
              />
              <button type="submit" className={cx(pullRight, btn, btnDefault)}>
                <FormattedMessage id="menu.login" />
              </button>
              <p className={cx(helpBlock)}>
                <FormattedMessage id="login.no-account" />
                <Link to="/auth/register">
                  <FormattedMessage id="menu.register" />
                </Link>
              </p>
            </Form>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginForm
