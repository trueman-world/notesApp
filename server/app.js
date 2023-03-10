const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const uri = config.MONGODB_URI

app.connectToDb = async () => {
  try {
    await mongoose.connect(uri)
    logger.info('Connected to db')
  } catch(ex) {
    logger.error('Failed to connect to db')
  }
}
app.connectToDb()

app.disconnectFromDb = async () => {
  await mongoose.connection.close()
}

app.use(cors())
app.use(express.json())
app.use(middleware.morgan)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app