const xss = require('xss')

const PredictionsService = {
  getAllPredictions(db) {
    return db
      .from('wishful_predictions')
      .select(
        'id',
        'prediction_who',
        'prediction_what',
        'prediction_when',
        'prediction_commentary',
        'created_by',
        'created_at'
      )
  },

  getById(db, id) {
    return PredictionsService.getAllPredictions(db)
      .where('id', id)
      .first()
  },

//   getCommentsForArticle(db, article_id) {
//     return db
//       .from('blogful_comments AS comm')
//       .select(
//         'comm.id',
//         'comm.text',
//         'comm.date_created',
//         db.raw(
//           `json_strip_nulls(
//             row_to_json(
//               (SELECT tmp FROM (
//                 SELECT
//                   usr.id,
//                   usr.user_name,
//                   usr.full_name,
//                   usr.nickname,
//                   usr.date_created,
//                   usr.date_modified
//               ) tmp)
//             )
//           ) AS "user"`
//         )
//       )
//       .where('comm.article_id', article_id)
//       .leftJoin(
//         'blogful_users AS usr',
//         'comm.user_id',
//         'usr.id',
//       )
//       .groupBy('comm.id', 'usr.id')
//   },

insertPrediction(db, newPrediction) {
  return db
    .insert(newPrediction)
    .into('wishful_predictions')
    .returning('*')
    .then(([prediction]) => prediction)
    .then(prediction =>
      PredictionsService.getById(db, prediction.id)
    )
},

  serializePrediction(prediction) {
    return {
        id: prediction.id,
        prediction_who: xss(prediction.prediction_who),
        prediction_what: xss(prediction.prediction_what),
        prediction_when: xss(prediction.prediction_when),
        prediction_commentary: xss(prediction.prediction_commentary),
        created_by: xss(prediction.created_by),
        created_at: xss(prediction.created_at)
        }
    },
}

module.exports = PredictionsService
