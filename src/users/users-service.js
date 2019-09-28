const xss = require('xss')

const UsersService = {
  getAllUsers(db) {
    return db
      .from('wishful_users')
      .select(
        'id',
        'user_name',
        'email',
      )
  },

  serializeUser(user) {
    return {
        id: user.id,
        user_name: xss(user.user_name),
        email: xss(user.email),
        }
    },
}

module.exports = UsersService
