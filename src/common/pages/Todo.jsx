
import React from 'react'
import {FormattedMessage} from 'react-intl'
import {Add, List} from 'common/todo/components'


const TodoPage = () =>
  <div>
    <h2>
      <FormattedMessage id="todo.title" />
    </h2>
    <List />
    <Add />
  </div>

export default TodoPage
