const express = require('express')
require('express-async-errors')
const cors = require('cors')

const loginRouter = require('./controllers/login')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

const middleware = require('./utils/middleware')
const config = require('./utils/config')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.set('strictPopulate', false)

const app = express()

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl)

app.use('/api/login', loginRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

app.use(middleware.errorHandler)
module.exports = app