const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

let notes = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelance',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  }
]

app.get('/info', (request, response) => {
  const date = new Date(Date.now()).toUTCString()
  response.send(
    `<h2>Phonebook has info for ${notes.length} people</h2> <h2>${date}</h2>`
  )
})

app.get('/api/persons', (request, response) => {
  response.json(notes)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find((element) => element.id === id)
  if (note) {
    response.json(note)
  } else {
    response.status(404).send('404 Not found')
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  notes = notes.filter((element) => element.id !== id)
  if (notes) {
    response.json(notes)
  } else {
    response.status(404).send('404 Not found')
  }
})

app.post(
  '/api/persons',
  morgan(function (tokens, req, res) {
    morgan.token('content', (req, res) => {
      return JSON.stringify(req.body)
    })
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      tokens.content(req, res)
    ].join(' ')
  }),
  (request, response) => {
    const note = request.body
    const correct = note.name && note.number
    if (correct) {
      const correct2 = notes.some((element) => element.name === note.name)
      if (!correct2) {
        const ids = notes.map((note) => note.id)
        const maxId = Math.max(...ids)
        const newNote = {
          id: maxId + 1,
          name: note.name,
          number: note.number
        }
        notes = [...notes, newNote]
        response.json(newNote)
      } else {
        response.status(409).send('Ya existe un usuario con este nombre')
      }
    } else {
      response.status(400).send('400 Bad Request')
    }
  }
)

// middleware para rutas inexistentes se agrega después de todas las rutas
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
