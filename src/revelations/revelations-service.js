const xss = require('xss')

const RevelationsService = {
  getAllRevelations(db) {
    return db
      .from('wishful_revelations')
      .select(
        'id',
        'revelation_text',
        'evidence',
        'prediction_id',
        'user_id',
        'revealed_at'
      )
  },

  serializeRevelation(revelation) {
    return {
        id: revelation.id,
        revelation_text: xss(revelation.revelation_text),
        evidence: xss(revelation.evidence),
        prediction_id: xss(revelation.prediction_id),
        user_id: xss(revelation.user_id),
        revealed_at: xss(revelation.revealed_at)
        }
    },
}

module.exports = RevelationsService
