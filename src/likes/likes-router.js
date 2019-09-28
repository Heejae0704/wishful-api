const express = require('express')
const LikesService = require('./likes-service')
const { requireAuth } = require('../middleware/jwt-auth')

const likesRouter = express.Router()

likesRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    LikesService.getAllLikes(req.app.get('db'))
      .then(likes => {
        res.json(likes.map(LikesService.serializeLike))
      })
      .catch(next)
  })

  module.exports = likesRouter