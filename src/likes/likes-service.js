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

  serializeLike(like) {
    return {
        id: like.id,
        source_type: xss(like.source_type),
        liked_at: xss(like.liked_at),
        source_id: like.source_id,
        user_id: like.user_id
        }
    },
}

module.exports = LikesService
