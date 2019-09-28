const express = require('express')
const PredictionsService = require('./predictions-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

const predictionsRouter = express.Router()
const jsonBodyParser = express.json()

predictionsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    PredictionsService.getAllPredictions(req.app.get('db'))
      .then(predictions => {
        res.json(predictions.map(PredictionsService.serializePrediction))
      })
      .catch(next)
  })

  predictionsRouter
    .route('/')
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
      const { prediction_what, prediction_who, prediction_when, prediction_commentary, created_by } = req.body
      const newPrediction = { prediction_what, prediction_who, prediction_when, prediction_commentary, created_by }

      for (const [key, value] of Object.entries(newPrediction))
        if (value == null)
          return res.status(400).json(
            { error: `Missing '${key}' in request body`}
          )

          PredictionsService.insertPrediction(
            req.app.get('db'),
            newPrediction
          )
            .then(prediction => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${prediction.id}` ))
                .json(PredictionsService.serializePrediction(prediction))
            })
              .catch(next)
          })


// articlesRouter
//   .route('/:article_id')
//   .all(requireAuth)
//   .all(checkArticleExists)
//   .get((req, res) => {
//     res.json(ArticlesService.serializeArticle(res.article))
//   })

// articlesRouter.route('/:article_id/comments/')
//   .all(requireAuth)
//   .all(checkArticleExists)
//   .get((req, res, next) => {
//     ArticlesService.getCommentsForArticle(
//       req.app.get('db'),
//       req.params.article_id
//     )
//       .then(comments => {
//         res.json(comments.map(ArticlesService.serializeArticleComment))
//       })
//       .catch(next)
//   })

// /* async/await syntax for promises */
// async function checkArticleExists(req, res, next) {
//   try {
//     const article = await ArticlesService.getById(
//       req.app.get('db'),
//       req.params.article_id
//     )

//     if (!article)
//       return res.status(404).json({
//         error: `Article doesn't exist`
//       })

//     res.article = article
//     next()
//   } catch (error) {
//     next(error)
//   }
// }

module.exports = predictionsRouter
