const xss = require('xss')

const CommentsService = {
  getAllComments(db) {
    return db
      .from('wishful_comments')
      .select(
        'id',
        'content',
        'user_id',
        'prediction_id',
        'commented_at'
      )
  },

  getById(db, id) {
    return CommentsService.getAllComments(db)
      .where('id', id)
      .first()
  },

  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into('wishful_comments')
      .returning('*')
      .then(([comment]) => comment)
      .then(comment =>
        CommentsService.getById(db, comment.id)
      )
  },

  serializeComment(comment) {
    return {
        id: comment.id,
        content: xss(comment.content),
        user_id: comment.user_id,
        prediction_id: comment.prediction_id,
        commented_at: xss(comment.commented_at),
        }
    },
}

module.exports = CommentsService
