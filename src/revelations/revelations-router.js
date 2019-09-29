const express = require('express')
const RevelationsService = require('./revelations-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

const revelationsRouter = express.Router()
const jsonBodyParser = express.json()

revelationsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    RevelationsService.getAllRevelations(req.app.get('db'))
      .then(revelations => {
        res.json(revelations.map(RevelationsService.serializeRevelation))
      })
      .catch(next)
  })
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { revelation_text, is_prediction_correct, evidence, prediction_id, user_id } = req.body
    const newRevelation = { revelation_text, is_prediction_correct, evidence, prediction_id, user_id }

    for (const [key, value] of Object.entries(newRevelation))
      if (value == null)
        return res.status(400).json(
          { error: `Missing '${key}' in request body`}
        )

        RevelationsService.insertRevelation(
          req.app.get('db'),
          newRevelation
        )
          .then(revelation => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${revelation.id}` ))
              .json(RevelationsService.serializeRevelation(revelation))
          })
            .catch(next)
        })

  module.exports = revelationsRouter