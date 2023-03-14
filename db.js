const mongoose = require('mongoose')
const { URI, URI_TEST, NODE_ENV } = process.env
const connectionString = NODE_ENV === 'test' ? URI_TEST : URI

const connect = async () => {
  try {
    mongoose.set('strictQuery', false)
    await mongoose.connect(connectionString)
    console.log('Database Connected', mongoose.connection.readyState)
  } catch (error) {
    console.log('Error: ', error)
  }
}

module.exports = { connect, mongoose }
