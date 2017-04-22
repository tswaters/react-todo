
import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {FormattedMessage} from 'react-intl'
import classNames from 'classnames/bind'
import * as bootstrap from 'common/styles/bootstrap'

import initialData from 'common/initial-data'
import {getItem, editTodo, removeTodo} from 'common/todo/redux'

const cx = classNames.bind(bootstrap)

@initialData({
  keys: [
    'todo.edit',
    'todo.delete'
  ]
})
@connect(
  (state, ownProps) => getItem(state, ownProps),
  dispatch => ({
    handleEditTodo: id => dispatch(editTodo(id)),
    handleRemoveTodo: id => dispatch(removeTodo(id))
  })
)
class Item extends PureComponent {

  static propTypes = {
    handleEditTodo: PropTypes.func.isRequired,
    handleRemoveTodo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    item: PropTypes.shape({
      text: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired
  }

  constructor (props) {
    super(props)

    this.handleEditTodo = this.handleEditTodo.bind(this)
    this.handleRemoveTodo = this.handleRemoveTodo.bind(this)
  }

  handleRemoveTodo () {
    this.props.handleRemoveTodo(this.props.id)
  }

  handleEditTodo () {
    this.props.handleEditTodo(this.props.id)
  }

  render () {
    return (
      <li>
        {this.props.item.text}
        <button className={cx('btn', 'btn-default')} onClick={this.handleEditTodo}>
          <FormattedMessage id="todo.edit" />
        </button>
        <button className={cx('btn', 'btn-danger')} onClick={this.handleRemoveTodo}>
          <FormattedMessage id="todo.delete" />
        </button>
      </li>
    )
  }

}

export default Item
