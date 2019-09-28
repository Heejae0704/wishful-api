const express = require('express')
const CommentsService = require('./comments-service')
const { requireAuth } = require('../middleware/jwt-auth')

const commentsRouter = express.Router()

commentsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    CommentsService.getAllComments(req.app.get('db'))
      .then(comments => {
        res.json(comments.map(CommentsService.serializeComment))
      })
      .catch(next)
  })

  module.exports = commentsRouter