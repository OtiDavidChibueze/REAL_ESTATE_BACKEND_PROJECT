// Real Estate Application File
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')

// activate express
const app = express()

// middleware
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.options('*', cors())
app.use(helmet())

// Routes
const User_Routes = require('./user.js')
const Property_Routes = require('./property.js')

app.use('/api/v1/property', Property_Routes)
app.use('/api/v1/user', User_Routes)

// export the application
module.exports = app
