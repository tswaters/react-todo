
import React, {PureComponent, PropTypes} from 'react'
import {connect} from 'react-redux'

import {editTodo} from '../actions'
import Item from './Item'

const mapDispatchToProps = {
  onTodoClick: editTodo
}

class List extends PureComponent {

  static propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      text: PropTypes.text
    })).isRequired
  }

  render () {
    if (this.props.list.length === 0) {
      return <p>{'No Todos!'}</p>
    }

    return (
      <ol>
        {this.props.list.map(todo =>
          <Item key={todo.id} todo={todo} />
        )}
      </ol>
    )
  }

}

export default connect(null, mapDispatchToProps)(List)
