const mongoose = require('mongoose')

const connectionString = process.env.URI

const connect = () => {
  mongoose.connect(connectionString).then(() => {
    console.log('Database connected')
  }).catch(err => {
    console.error(err)
  })
}

module.exports = { connect, mongoose }

// const note = new Note({
//   name: 'Santiago Losada Losada',
//   number: '3128091936'
// })

// note.save().then((response) => {
//   console.log(response)
//   mongoose.connection.close()
// }).catch(err => {
//   console.error(err)
// })

// Note.find({}).then((response) => {
//   console.log(response)
//   mongoose.connection.close()
// }).catch(err => {
//   console.log(err)
// })
