const express = require('express')
const CommentsService = require('./comments-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

const commentsRouter = express.Router()
const jsonBodyParser = express.json()

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
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { content, user_id, prediction_id, commented_at } = req.body
    const newComment = { content, user_id, prediction_id, commented_at }

    for (const [key, value] of Object.entries(newComment))
      if (value == null)
        return res.status(400).json(
          { error: `Missing '${key}' in request body`}
        )

        CommentsService.insertComment(
          req.app.get('db'),
          newComment
        )
          .then(comment => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${comment.id}` ))
              .json(CommentsService.serializeComment(comment))
          })
            .catch(next)
        })

  module.exports = commentsRouter