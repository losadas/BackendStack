require('dotenv').config()
const { connect, mongoose } = require('./db')
const Note = require('./models/Note')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const notFoundEndpoint = require('./middlewars/notFoundEndpoint')
const idMalformed = require('./middlewars/idMalformed')

const app = express()

app.use(cors())
app.use(express.json())

// get
app.get('/info', morgan('tiny'), (request, response) => {
  connect().then(() => {
    const length = Note.find({}).then((res) => {
      mongoose.connection.close(() => {
        console.log('Closed Connection', mongoose.connection.readyState)
      })
      return res
    })
    const date = new Date(Date.now()).toUTCString()
    response.send(
      `<h2>Phonebook has info for ${length.length} people</h2> <h2>${date}</h2>`
    )
  })
})

app.get('/api/persons', morgan('tiny'), (request, response) => {
  connect().then(() => {
    Note.find({}).then((res) => {
      response.json(res)
      mongoose.connection.close(() => {
        console.log('Closed Connection', mongoose.connection.readyState)
      })
    })
  })
})

app.get('/api/persons/:id', morgan('tiny'), (request, response, next) => {
  connect().then(() => {
    const id = request.params.id
    Note.findById(id)
      .then((res) => {
        response.json(res)
        mongoose.connection.close(() => {
          console.log('Closed Connection', mongoose.connection.readyState)
        })
      })
      .catch((err) => {
        next(err)
      })
  })
})

app.delete('/api/persons/:id', morgan('tiny'), (request, response, next) => {
  connect().then(() => {
    const id = request.params.id
    Note.findByIdAndDelete(id)
      .then((res) => {
        response.json(res).end()
        mongoose.connection.close(() => {
          console.log('Closed Connection', mongoose.connection.readyState)
        })
      })
      .catch((err) => next(err))
  })
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
    connect().then(() => {
      const note = new Note(request.body)
      if (!note.number) {
        response.status(400).end()
      } else {
        note
          .save()
          .then((res) => {
            response.json(res)
            mongoose.connection.close(() => {
              console.log('Closed Connection', mongoose.connection.readyState)
            })
          })
          .catch((err) => console.log(err))
      }
    })
  }
)

app.put('/api/persons/:id', (request, response, next) => {
  connect().then(() => {
    const id = request.params.id
    const note = request.body
    const newNoteInfo = {
      name: note.name,
      number: note.number
    }
    Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
      .then((result) => {
        console.log('Actualizado')
        response.json(result).end()
        mongoose.connection.close(() => {
          console.log('Closed Connection', mongoose.connection.readyState)
        })
      })
      .catch((err) => next(err))
  })
})

app.use(idMalformed)

app.use(notFoundEndpoint)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, server }
