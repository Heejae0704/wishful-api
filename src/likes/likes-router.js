const express = require('express')
const LikesService = require('./likes-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

const likesRouter = express.Router()
const jsonBodyParser = express.json()

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
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { source_type, source_id, user_id } = req.body
    const newLike = { source_type, source_id, user_id }

    for (const [key, value] of Object.entries(newLike))
      if (value == null)
        return res.status(400).json(
          { error: `Missing '${key}' in request body`}
        )

        LikesService.insertLike(
          req.app.get('db'),
          newLike
        )
          .then(like => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${like.id}` ))
              .json(LikesService.serializeLike(like))
          })
            .catch(next)
    })

likesRouter
  .route('/:like_id')
  .all(requireAuth, (req, res, next) => {
      LikesService.getById(
          req.app.get('db'),
          req.params.like_id,
      )
        .then(like => {
            if(!like) {
                return res.status(400).json({
                    error: { message: `Article does't exist` }
                })
            }
            res.like = like
            next()
        })
        .catch(next)
  })
  .delete((req, res, next) => {
      LikesService.deleteLike(
          req.app.get('db'),
          req.params.like_id
      )
        .then(() => {
            res.status(204).end()
        })
        .catch(next)
  })

  module.exports = likesRouter