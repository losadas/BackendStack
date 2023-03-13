const { model, Schema } = require('mongoose')
const noteSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    number: {
      type: String,
      required: true
    }
  },
  { versionKey: false }
)

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject._id
  }
})
const Note = model('Note', noteSchema)

module.exports = Note
