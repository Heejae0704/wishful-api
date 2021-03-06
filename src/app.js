const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const authRouter = require('./auth/auth-router')
const predictionsRouter = require('./predictions/predictions-router')
const revelationsRouter = require('./revelations/revelations-router')
const usersRouter = require('./users/users-router')
const commentsRouter = require('./comments/comments-router')
const likesRouter = require('./likes/likes-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/predictions', predictionsRouter)
app.use('/api/revelations', revelationsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/likes', likesRouter)

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.log(error)
        response = { message: error.message, error }
    }
    // console.log(error)
    // response = { message: error.message, error }
    // res.status(500).json(response)
})

module.exports = app