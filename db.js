const mongoose = require('mongoose')

const connectionString = process.env.URI

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
