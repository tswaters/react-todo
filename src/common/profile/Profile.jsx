
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {intlShape, FormattedMessage} from 'react-intl'
import {connect} from 'react-redux'
import {Helmet} from 'react-helmet'
import cx from 'classnames'
import {
  row,
  colXs12,
  colXs6,
  textRight,
  panel,
  panelHeading,
  panelFooter,
  panelDefault,
  panelBody,
  btn,
  btnPrimary
} from 'common/styles/bootstrap'

import Form from 'common/components/Form'
import FormInput from 'common/components/FormInput'
import {getProfile, fetchProfile, updateText, changeUser, changePassword} from 'common/profile/redux'
import initialData from 'common/initial-data'

@initialData({
  keys: [
    'auth.userName',
    'form.errors.same-as',
    'profile.title',
    'profile.change-password',
    'profile.old-password',
    'profile.new-password',
    'profile.confirm-password',
    'profile.change-details',
    'profile.password-change-successful',
    'profile.profile-change-successful'
  ],
  promises: [
    dispatch => ({staticContext, history, location}) =>
      dispatch(fetchProfile())
        .catch(err => {
          if (err.status === 401) {
            staticContext.status = err.status
            staticContext.error = err
            staticContext.url = `/auth/login?from=${location.pathname}`
            history.replace(staticContext.url)
          }
          throw err
        })
  ]
})
@connect(
  state => getProfile(state),
  dispatch => ({
    updateText: (fieldName, value) => dispatch(updateText(fieldName, value)),
    changeUser: userName => dispatch(changeUser(userName)),
    changePassword: (oldPassword, newPassword) => dispatch(changePassword(oldPassword, newPassword))
  })
)
class ProfilePage extends PureComponent {

  static defaultProps = {
    shouldClear: false
  }

  static contextTypes = {
    intl: intlShape.isRequired
  }

  static propTypes = {
    shouldClear: PropTypes.bool,
    userName: PropTypes.string.isRequired,
    oldPassword: PropTypes.string.isRequired,
    newPassword: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
    updateText: PropTypes.func.isRequired,
    changeUser: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.handleChangeDetailsSubmit = this.handleChangeDetailsSubmit.bind(this)
    this.handleChangePasswordSubmit = this.handleChangePasswordSubmit.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.shouldClear !== nextProps.shouldClear && nextProps.shouldClear === true) {
      this.userName.setState({error: null, validating: false})
      this.oldPassword.setState({error: null, validating: false})
      this.newPassword.setState({error: null, validating: false})
      this.confirmPassword.setState({error: null, validating: false})
    }
  }

  userName = null
  oldPassword = null
  newPassword = null
  confirmPassword = null

  setRef (name) {
    return _ref => this[name] = _ref
  }

  handleChangeDetailsSubmit () {
    this.props.changeUser(this.props.userName)
  }

  handleChangePasswordSubmit () {
    this.props.changePassword(this.props.oldPassword, this.props.newPassword)
  }

  updateText (fieldName) {
    return event => this.props.updateText(fieldName, event.target.value)
  }

  render () {
    const title = this.context.intl.formatMessage({id: 'profile.title'})
    const password = this.context.intl.formatMessage({id: 'profile.new-password'})
    return (
      <div>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Form className={cx(panel, panelDefault)} onSubmit={this.handleChangeDetailsSubmit}>
          <header className={cx(panelHeading)}>
            <h3><FormattedMessage id="profile.change-details" /></h3>
          </header>
          <section className={cx(panelBody)}>
            <FormInput
              ref={this.setRef('userName')}
              id="user-name"
              required
              label={this.context.intl.formatMessage({id: 'auth.userName'})}
              value={this.props.userName}
              onChange={this.updateText('userName')}
            />
          </section>
          <footer className={cx(panelFooter, textRight)}>
            <button type="submit" className={cx(btn, btnPrimary)}>
              <FormattedMessage id="profile.change-details" />
            </button>
          </footer>
        </Form>
        <Form className={cx(panel, panelDefault)} onSubmit={this.handleChangePasswordSubmit}>
          <header className={cx(panelHeading)}>
            <h3><FormattedMessage id="profile.change-password" /></h3>
          </header>
          <section className={cx(panelBody)}>
            <div className={cx(row)}>
              <div className={cx(colXs12)}>
                <FormInput
                  ref={this.setRef('oldPassword')}
                  id="old-password"
                  type="password"
                  required
                  label={this.context.intl.formatMessage({id: 'profile.old-password'})}
                  value={this.props.oldPassword}
                  onChange={this.updateText('oldPassword')}
                />
              </div>
            </div>
            <div className={cx(row)}>
              <div className={cx(colXs6)}>
                <FormInput
                  ref={this.setRef('newPassword')}
                  id="new-password"
                  type="password"
                  required
                  label={password}
                  value={this.props.newPassword}
                  onChange={this.updateText('newPassword')}
                />
              </div>
              <div className={cx(colXs6)}>
                <FormInput
                  ref={this.setRef('confirmPassword')}
                  id="confirm-password"
                  type="password"
                  required
                  sameAs="new-password"
                  sameAsError={this.context.intl.formatMessage({id: 'form.errors.same-as'}, {sameAs: password})}
                  label={this.context.intl.formatMessage({id: 'profile.confirm-password'})}
                  value={this.props.confirmPassword}
                  onChange={this.updateText('confirmPassword')}
                />
              </div>
            </div>
          </section>
          <footer className={cx(panelFooter, textRight)}>
            <button type="submit" className={cx(btn, btnPrimary)}>
              <FormattedMessage id="profile.change-password" />
            </button>
          </footer>
        </Form>
      </div>
    )
  }
}

export default ProfilePage
