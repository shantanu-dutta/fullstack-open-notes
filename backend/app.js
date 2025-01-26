import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import mongoose from 'mongoose'

import config from './utils/config.js'
import logger from './utils/logger.js'
import middleware from './utils/middleware.js'

import notesRouter from './controllers/notes.js'

mongoose.set('strictQuery', false)

logger.info('🌐 Connecting to MongoDB...')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('✅ Successfully connected to MongoDB!')
  })
  .catch(error => {
    logger.error('❌ Failed to connect to MongoDB. Please check your connection settings.')
    logger.error(`Error: ${error.message}`)
  })

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

export default app
