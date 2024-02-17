import React, { Fragment, useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { TodoListForm } from './TodoListForm'

const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 10000,
})

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState([])
  const [activeList, setActiveList] = useState()

  useEffect(async () => {
    try {
      const { data } = await apiClient.get('/todo-lists')
      setTodoLists(data)
    } catch (error) {
      console.error(error)
    }
  }, [])

  const saveTodoList = useCallback(
    async (id, { todos }) => {
      setTodoLists([
        ...todoLists.map((todoList) => {
          if (todoList.id !== id) {
            return todoList
          }
          return {
            ...todoList,
            todos,
          }
        }),
      ])

      try {
        await apiClient.patch(`/todo-lists/${id}`, { todos })
      } catch (error) {
        console.error(error)
      }
    },
    [todoLists],
  )

  if (!todoLists.length) return null

  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <List>
            {todoLists.map((todoList) => {
              const hasIncompleteTodos = todoList.todos.some((todo) => !todo.completed)

              return (
                <ListItemButton key={todoList.id} onClick={() => setActiveList(todoList)}>
                  <ListItemIcon>
                    <ReceiptIcon />
                  </ListItemIcon>
                  <ListItemText primary={todoList.title} />
                  Status: {hasIncompleteTodos ? 'incomplete todos' : 'all todos done'}
                </ListItemButton>
              )
            })}
          </List>
        </CardContent>
      </Card>
      {activeList && (
        <TodoListForm
          key={activeList.id} // use key to make React recreate component to reset internal state
          todoList={activeList}
          saveTodoList={saveTodoList}
        />
      )}
    </Fragment>
  )
}
