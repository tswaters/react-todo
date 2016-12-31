
import React from 'react'

import {Add, List} from 'common/todo/components'
import {container} from 'common/todo/styles'

const TodoPage = () =>
  <div className={container}>
    <h2>{'Todos'}</h2>
    <List />
    <Add />
  </div>

export default TodoPage
