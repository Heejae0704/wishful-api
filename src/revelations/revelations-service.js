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

  getById(db, id) {
    return RevelationsService.getAllRevelations(db)
      .where('id', id)
      .first()
  },

  insertRevelation(db, newRevelation) {
    return db
      .insert(newRevelation)
      .into('wishful_revelations')
      .returning('*')
      .then(([revelation]) => revelation)
      .then(revelation =>
        RevelationsService.getById(db, revelation.id)
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
