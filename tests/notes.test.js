const supertest = require('supertest')
const { app, server } = require('../index')
const { initialNotes } = require('./helpers')
const { connect, mongoose } = require('../db')
const Note = require('../models/Note')
const api = supertest(app)

beforeEach(async () => {
  await connect()
  await Note.deleteMany({})

  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
  mongoose.connection.close(() => {
    console.log('Closed Connection', mongoose.connection.readyState)
  })
})

test('notes are returned as json', async () => {
  await api
    .get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are two notes', async () => {
  const response = await api.get('/api/persons')
  expect(response.body).toHaveLength(initialNotes.length)
})

test('a valid note can be added', async () => {
  const newNote = {
    name: 'nueva uwu',
    number: '00000001'
  }
  await api
    .post('/api/persons')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/persons')
  const contents = response.body.map((note) => note.name)
  expect(response.body).toHaveLength(initialNotes.length + 1)
  expect(contents).toContain(newNote.name)
})

test('note without number is not added', async () => {
  const newNote = {
    name: 'nueva uwu'
  }
  await api.post('/api/persons').send(newNote).expect(400)

  const response = await api.get('/api/persons')
  expect(response.body).toHaveLength(initialNotes.length)
})

afterAll(() => {
  server.close()
})
