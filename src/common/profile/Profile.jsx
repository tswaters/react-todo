
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {intlShape, FormattedMessage} from 'react-intl'
import {connect} from 'react-redux'
import {Helmet} from 'react-helmet'
import cx from 'classnames'
import {faUser} from 'common/styles/font-awesome'
import {
  row,
  colXs12,
  colSm6,
  colSmOffset3,
  panel,
  panelTitle,
  panelHeading,
  panelDefault,
  panelBody,
  btn,
  btnPrimary,
  pullRight
} from 'common/styles/bootstrap'

import Form from 'common/components/Form'
import FormInput from 'common/components/FormInput'
import {getProfile, updateText, changeUser, changePassword} from 'common/redux/profile'

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

  UNSAFE_componentWillReceiveProps (nextProps) {
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
      <div className={cx(row)}>
        <div className={cx(colXs12, colSm6, colSmOffset3)}>
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <Form className={cx(panel, panelDefault)} onSubmit={this.handleChangeDetailsSubmit}>
            <div className={cx(panelHeading)}>
              <h2 className={cx(panelTitle)}>
                <FormattedMessage id="profile.change-details" />
              </h2>
            </div>
            <section className={cx(panelBody)}>
              <FormInput
                ref={this.setRef('userName')}
                icon={faUser}
                id="user-name"
                required
                label={this.context.intl.formatMessage({id: 'auth.userName'})}
                value={this.props.userName}
                onChange={this.updateText('userName')}
              />
              <button type="submit" className={cx(btn, btnPrimary, pullRight)}>
                <FormattedMessage id="profile.change-details" />
              </button>
            </section>
          </Form>
          <Form className={cx(panel, panelDefault)} onSubmit={this.handleChangePasswordSubmit}>
            <div className={cx(panelHeading)}>
              <h2 className={cx(panelTitle)}>
                <FormattedMessage id="profile.change-password" />
              </h2>
            </div>
            <section className={cx(panelBody)}>

              <FormInput
                ref={this.setRef('oldPassword')}
                id="old-password"
                type="password"
                required
                placeholder={this.context.intl.formatMessage({id: 'profile.old-password'})}
                value={this.props.oldPassword}
                onChange={this.updateText('oldPassword')}
              />

              <FormInput
                ref={this.setRef('newPassword')}
                id="new-password"
                type="password"
                required
                placeholder={password}
                value={this.props.newPassword}
                onChange={this.updateText('newPassword')}
              />

              <FormInput
                ref={this.setRef('confirmPassword')}
                id="confirm-password"
                type="password"
                required
                sameAs="new-password"
                sameAsError={this.context.intl.formatMessage({id: 'form.errors.same-as'}, {sameAs: password})}
                placeholder={this.context.intl.formatMessage({id: 'profile.confirm-password'})}
                value={this.props.confirmPassword}
                onChange={this.updateText('confirmPassword')}
              />

              <button type="submit" className={cx(btn, btnPrimary, pullRight)}>
                <FormattedMessage id="profile.change-password" />
              </button>
            </section>
          </Form>
        </div>
      </div>
    )
  }
}

export default ProfilePage
