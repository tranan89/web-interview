import React, { useState, useCallback, useEffect } from 'react'
import debounce from 'lodash/debounce'
import {
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Checkbox,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'

export const TodoListForm = ({ todoList, saveTodoList }) => {
  const [todos, setTodos] = useState(todoList.todos)
  const [editing, setEditing] = useState(false)

  const debouncedUpdateTodoList = useCallback(
    debounce(async ({ id, todos }) => {
      await saveTodoList(id, { todos })
      setEditing(false)
    }, 300),
    [saveTodoList, setEditing],
  )

  const updateTodoList = useCallback(() => {
    debouncedUpdateTodoList({ id: todoList.id, todos })
  }, [todoList.id, todos])

  useEffect(() => {
    if (editing) {
      updateTodoList()
    }
  }, [editing, updateTodoList])

  useEffect(() => {
    setEditing(true)
  }, [todos, setEditing])

  const updateTodo = useCallback(
    (id, updatedContent) => {
      setTodos(
        todos.map((todo) => {
          if (todo.id !== id) {
            return todo
          }
          return {
            ...todo,
            ...updatedContent,
          }
        }),
      )
    },
    [todos, setTodos],
  )

  return (
    <Card sx={{ margin: '0 1rem' }}>
      <CardContent>
        <Typography component='h2'>{todoList.title}</Typography>
        <form style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {todos.map((todo) => {
            const { id, text, completed } = todo

            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ margin: '8px' }} variant='h6'>
                  {id}
                </Typography>
                <TextField
                  sx={{ flexGrow: 1, marginTop: '1rem' }}
                  label='What to do?'
                  value={text}
                  onChange={(event) => updateTodo(id, { text: event.target.value })}
                />
                <Checkbox
                  checked={completed}
                  onChange={() => updateTodo(id, { completed: !completed })}
                />
                <Button
                  sx={{ margin: '8px' }}
                  size='small'
                  color='secondary'
                  onClick={() => {
                    setTodos(todos.filter((todo) => todo.id !== id))
                  }}
                >
                  <DeleteIcon />
                </Button>
              </div>
            )
          })}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, { id: todos.length + 1, text: '', completed: false }])
              }}
            >
              Add Todo <AddIcon />
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
