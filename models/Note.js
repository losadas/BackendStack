const { model, Schema } = require('mongoose')
const noteSchema = new Schema({
  name: String,
  number: String
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Note = model('Note', noteSchema)

module.exports = Note
