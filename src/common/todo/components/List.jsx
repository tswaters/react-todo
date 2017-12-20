
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {intlShape} from 'react-intl'
import cx from 'classnames'
import FormInput from 'common/components/FormInput'

import {
  todoListGroupItem,
  todoFormGroup,
  todoFormControl,
  todoBtn
} from 'common/todo/styles/todo'

import {
  btnDanger,
  btnPrimary,
  listGroup
} from 'common/styles/bootstrap'

import {
  fa,
  faTimes,
  faPlus
} from 'common/styles/font-awesome'

import initialData from 'common/initial-data'
import {
  getList,
  updateTodoText,
  createTodo,
  saveTodo,
  removeTodo
} from 'common/redux/todo'

@initialData({
  keys: [
    'todo.no-items',
    'todo.todo',
    'todo.delete',
    'todo.create'
  ]
})
@connect(
  state => getList(state),
  dispatch => ({
    handleUpdateTodo: (id, text) => dispatch(updateTodoText(id, text)),
    handleCreateTodo: text => dispatch(createTodo(text)),
    handleSaveTodo: todo => dispatch(saveTodo(todo)),
    handleRemoveTodo: id => dispatch(removeTodo(id))
  })
)
class List extends PureComponent {

  static contextTypes = {
    intl: intlShape.isRequired
  }

  static defaultProps = {
    list: []
  }

  static propTypes = {
    item: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    })),
    handleCreateTodo: PropTypes.func.isRequired,
    handleUpdateTodo: PropTypes.func.isRequired,
    handleSaveTodo: PropTypes.func.isRequired,
    handleRemoveTodo: PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context)
    this.handleTextChange = this.handleTextChange.bind(this)
    this.handleNewTodo = this.handleNewTodo.bind(this)
    this.handleTodoSave = this.handleTodoSave.bind(this)
    this.handleRemoveTodo = this.handleRemoveTodo.bind(this)
  }

  inputs = {}

  handleTodoSave (todo) {
    return () => {
      if (!this.inputs[todo.id].state.error) {
        this.props.handleSaveTodo(todo)
          .then(() => this.inputs[todo.id].setState({error: null, validating: null}))
      }
    }
  }

  handleTextChange (todo) {
    return event => this.props.handleUpdateTodo(todo ? todo.id : null, event.target.value)
  }

  handleNewTodo () {
    return () => this.props.handleCreateTodo(this.props.item)
      .then(() => this.inputs.new.setState({error: null, validating: null}))
  }

  handleRemoveTodo (todo) {
    return () => this.props.handleRemoveTodo(todo.id)
      .then(() => delete this.inputs[todo.id])
  }

  getItem (todo) {
    return (
      <li className={cx(todoListGroupItem)} key={todo.id}>
        <FormInput
          id={`todo_${todo.id}`}
          className={cx(todoFormGroup)}
          inputClassName={cx(todoFormControl)}
          required
          ref={_ref => this.inputs[todo.id] = _ref}
          placeholder={this.context.intl.formatMessage({id: 'todo.todo'})}
          value={todo.text}
          validate="change"
          onChange={this.handleTextChange(todo)}
          onBlur={this.handleTodoSave(todo)}
          buttons={[
            <button
              key="remove"
              type="button"
              className={cx(btnDanger, todoBtn)}
              onClick={this.handleRemoveTodo(todo)}
              aria-label={this.context.intl.formatMessage({id: 'todo.delete'})}
            >
              <span className={cx(fa, faTimes)} aria-hidden />
            </button>
          ]}
        />
      </li>
    )
  }

  render () {
    return (
      <ol className={cx(listGroup)}>
        {this.props.list.map(todo => this.getItem(todo))}
        <li className={cx(todoListGroupItem)} key="new">
          <FormInput
            id="new"
            className={cx(todoFormGroup)}
            inputClassName={cx(todoFormControl)}
            required
            ref={_ref => this.inputs.new = _ref}
            placeholder={this.context.intl.formatMessage({id: 'todo.todo'})}
            value={this.props.item}
            validate="blur"
            onChange={this.handleTextChange()}
            buttons={[
              <button
                key="remove"
                type="button"
                className={cx(btnPrimary, todoBtn)}
                onClick={this.handleNewTodo()}
                aria-label={this.context.intl.formatMessage({id: 'todo.create'})}
              >
                <span className={cx(fa, faPlus)} aria-hidden />
              </button>
            ]}
          />
        </li>
      </ol>
    )
  }

}

export default List
