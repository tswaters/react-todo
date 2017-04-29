
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {FormattedMessage, intlShape} from 'react-intl'
import classNames from 'classnames/bind'
import * as bootstrap from 'common/styles/bootstrap'

import Form from 'common/components/Form'
import FormInput from 'common/components/FormInput'

import initialData from 'common/initial-data'
import {createTodo, updateTodo, updateTodoText, getEditing} from 'common/todo/redux'

const cx = classNames.bind(bootstrap)

@initialData({
  keys: [
    'todo.update',
    'todo.create',
    'todo.todo'
  ]
})
@connect(
  state => getEditing(state),
  dispatch => ({
    createTodo: text => dispatch(createTodo(text)),
    updateTodo: text => dispatch(updateTodo(text)),
    onTextChange: text => dispatch(updateTodoText(text))
  })
)
class Add extends PureComponent {

  static contextTypes = {
    intl: intlShape.isRequired
  }

  static propTypes = {
    createTodo: PropTypes.func.isRequired,
    onTextChange: PropTypes.func.isRequired,
    updateTodo: PropTypes.func.isRequired,
    id: PropTypes.string,
    text: PropTypes.string.isRequired
  }

  static defaultProps = {
    id: null
  }

  constructor (props) {
    super(props)
    this.todo = null
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTextChange = this.handleTextChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.id !== nextProps.id) {
      this.setState({error: null, validating: false})
    }
  }

  handleTextChange (event) {
    this.props.onTextChange(event.target.value)
  }

  handleSubmit (event) {
    event.preventDefault()
    if (this.props.id) {
      this.props.updateTodo({id: this.props.id, text: this.props.text})
    } else {
      this.props.createTodo(this.props.text)
    }
    this.todo.setState({error: null, validating: false})
  }

  render () {
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormInput
          id="todo"
          required
          ref={_ref => this.todo = _ref}
          label={this.context.intl.formatMessage({id: 'todo.todo'})}
          onChange={this.handleTextChange}
          value={this.props.text}
        />
        <button type="submit" className={cx('btn', 'btn-default')}>
          <FormattedMessage id={this.props.id ? 'todo.update' : 'todo.create'} />
        </button>
      </Form>
    )
  }
}

export default Add
