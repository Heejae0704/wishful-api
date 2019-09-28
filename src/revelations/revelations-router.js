const express = require('express')
const RevelationsService = require('./revelations-service')
const { requireAuth } = require('../middleware/jwt-auth')

const revelationsRouter = express.Router()

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

  module.exports = revelationsRouter