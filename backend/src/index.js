const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('node:fs/promises')
const app = express()

app.use(cors())
app.use(express.json())

const PORT = 3001

app
  .get('/todo-lists', async (req, res) => {
    try {
      const json = await fs.readFile(path.join(__dirname, 'todo-lists.json'), 'utf8')
      const todoLists = JSON.parse(json)

      res.send(todoLists).send()
    } catch (error) {
      res.status(500).send()
    }
  })
  .patch('/todo-lists/:id', async (req, res) => {
    try {
      const { id } = req.params
      const { todos } = req.body

      const json = await fs.readFile(path.join(__dirname, 'todo-lists.json'), 'utf8')
      const todoLists = JSON.parse(json)

      const updatedTodoLists = todoLists.map((todoList) => {
        if (todoList.id !== id) {
          return todoList
        }
        return {
          ...todoList,
          todos,
        }
      })

      await fs.writeFile(path.join(__dirname, 'todo-lists.json'), JSON.stringify(updatedTodoLists))

      res.status(204).send()
    } catch (error) {
      res.status(500).send()
    }
  })

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
