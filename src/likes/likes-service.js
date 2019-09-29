const xss = require('xss')

const LikesService = {
  getAllLikes(db) {
    return db
      .from('wishful_likes')
      .select(
        'id',
        'source_type',
        'source_id',
        'user_id',
        'liked_at'
      )
  },

  getById(db, id) {
    return LikesService.getAllLikes(db)
      .where('id', id)
      .first()
  },

  insertLike(db, newLike) {
    return db
      .insert(newLike)
      .into('wishful_likes')
      .returning('*')
      .then(([like]) => like)
      .then(like =>
        LikesService.getById(db, like.id)
      )
  },

  serializeLike(like) {
    return {
        id: like.id,
        source_type: xss(like.source_type),
        liked_at: xss(like.liked_at),
        source_id: like.source_id,
        user_id: like.user_id
        }
  },

  deleteLike(db, likeId) {
    return db
        .from('wishful_likes')
        .where('id', likeId)
        .delete()
  },
}

module.exports = LikesService
