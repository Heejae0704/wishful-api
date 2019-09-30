const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      email: 'TU1@gmail.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      email: 'TU2@gmail.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      email: 'TU3@gmail',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      email: 'TU4@gmail.com',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

function makePredictionsArray(users) {
  return [
    {
      id: 1,
      prediction_who: 'Amazon',
      prediction_what: 'launch the kindle',
      prediction_when: '2010-10-10',
      prediction_commentary: 'because I want it',
      created_by: users[0].user_name,
      created_at: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
        id: 2,
        prediction_who: 'BTS',
        prediction_what: 'be famous in the entire universe',
        prediction_when: '2020-10-01',
        prediction_commentary: 'because they are good',
        created_by: users[1].user_name,
        created_at: new Date('2029-01-22T16:28:32.615Z'),
      },
    
  ]
}

function makeRevelationsArray(users, predictions) {
    return [
      {
        id: 1,
        revelation_text: 'No launch at all',
        is_prediction_correct: true,
        prediction_id: predictions[0].id,
        user_id: users[0].id,
        revealed_at: new Date('2029-01-22T16:28:32.615Z'),
        evidence: 'https://www.google.com'
      },
    ]
}

function makeCommentsArray(users, predictions) {
    return [
      {
        id: 1,
        content: 'I would be happy also',
        user_id: users[2].id,
        prediction_id: predictions[0].id,
        commented_at: new Date('2029-01-22T16:28:32.615Z')
      },
    ]
}

function makeLikesArray(users, predictions) {
    return [
        { 
            id: 1,
            source_type: 'prediction',
            source_id: predictions[0].id,
            user_id: users[3].id,
            liked_at: new Date('2029-01-22T16:28:32.615Z')
        }
    ]
}

// function makeExpectedArticle(users, article, comments=[]) {
//   const author = users
//     .find(user => user.id === article.author_id)

//   const number_of_comments = comments
//     .filter(comment => comment.article_id === article.id)
//     .length

//   return {
//     id: article.id,
//     style: article.style,
//     title: article.title,
//     content: article.content,
//     date_created: article.date_created.toISOString(),
//     number_of_comments,
//     author: {
//       id: author.id,
//       user_name: author.user_name,
//       full_name: author.full_name,
//       nickname: author.nickname,
//       date_created: author.date_created.toISOString(),
//       date_modified: author.date_modified || null,
//     },
//   }
// }

// function makeExpectedArticleComments(users, articleId, comments) {
//   const expectedComments = comments
//     .filter(comment => comment.article_id === articleId)

//   return expectedComments.map(comment => {
//     const commentUser = users.find(user => user.id === comment.user_id)
//     return {
//       id: comment.id,
//       text: comment.text,
//       date_created: comment.date_created.toISOString(),
//       user: {
//         id: commentUser.id,
//         user_name: commentUser.user_name,
//         full_name: commentUser.full_name,
//         nickname: commentUser.nickname,
//         date_created: commentUser.date_created.toISOString(),
//         date_modified: commentUser.date_modified || null,
//       }
//     }
//   })
// }

function makeWishfulFixtures() {
  const testUsers = makeUsersArray()
  const testPredictions = makePredictionsArray(testUsers)
  const testRevelations = makeRevelationsArray(testUsers, testPredictions)
  const testComments = makeCommentsArray(testUsers, testPredictions)
  const testLikes = makeLikesArray(testUsers, testPredictions)

  return { testUsers, testPredictions, testRevelations, testComments, testLikes }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        wishful_likes,
        wishful_comments,
        wishful_revelations,
        wishful_predictions,
        wishful_users
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE wishful_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE wishful_predictions_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE wishful_revelations_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE wishful_comments_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE wishful_likes_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('wishful_users_id_seq', 0)`),
        trx.raw(`SELECT setval('wishful_predictions_id_seq', 0)`),
        trx.raw(`SELECT setval('wishful_revelations_id_seq', 0)`),
        trx.raw(`SELECT setval('wishful_comments_id_seq', 0)`),
        trx.raw(`SELECT setval('wishful_likes_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user, password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('wishful_users').insert(preppedUsers)
    .then(() => 
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('wishful_users_id_seq', ?)`, [users[users.length - 1].id],
      )
    )
}


// function seedWishfulTables(db, users, predictions, revelations, comments, likes) {
//     const preppedUsers = users.map(user => ({
//         ...user, password: bcrypt.hashSync(user.password, 1)
//       }))
//   return db.into('wishful_users').insert(preppedUsers)
// //   .then(() => 
// //     // update the auto sequence to stay in sync
// //     db.raw(
// //       `SELECT setval('wishful_users_id_seq', ?)`, [users[users.length - 1].id],
// //     )
// //   )
//   .then(() => db.into('wishful_predictions').insert(predictions))
// //   .then(() => {
// //       db.raw(
// //         `SELECT setval('wishful_predictions_id_seq', ?)`, [predictions[predictions.length - 1].id],
// //       )
// //   })
//   .then(() => db.into('wishful_revelations').insert(revelations))
// //   .then(() => {
// //       db.raw(
// //         `SELECT setval('wishful_revelations_id_seq', ?)`, [revelations[revelations.length - 1].id],
// //       )
// //   })
//   .then(() => db.into('wishful_comments').insert(comments))
// //   .then(() => {
// //       db.raw(
// //         `SELECT setval('wishful_comments_id_seq', ?)`, [comments[comments.length - 1].id],
// //       )
// //   })
//   .then(() => db.into('wishful_likes').insert(likes))
// //   .then(() => {
// //       db.raw(
// //         `SELECT setval('wishful_likes_id_seq', ?)`, [likes[likes.length - 1].id],
// //       )
// //   })
// }


function seedWishfulTables(db, users, predictions, revelations, comments, likes) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('wishful_predictions').insert(predictions)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('wishful_predictions_id_seq', ?)`,
      [predictions[predictions.length - 1].id],
    )
    
    await trx.into('wishful_revelations').insert(revelations)
    await trx.raw(
        `SELECT setval('wishful_revelations_id_seq', ?)`,
        [revelations[revelations.length - 1].id],
    )

    await trx.into('wishful_comments').insert(comments)
    await trx.raw(
        `SELECT setval('wishful_comments_id_seq', ?)`,
        [comments[comments.length - 1].id],
    )

    await trx.into('wishful_likes').insert(likes)
    await trx.raw(
        `SELECT setval('wishful_likes_id_seq', ?)`,
        [likes[likes.length - 1].id],
    )
    
  })
}

function seedMaliciousArticle(db, user, article) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('blogful_articles')
        .insert([article])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makePredictionsArray,
  makeRevelationsArray,
  makeCommentsArray,
  makeLikesArray,

  makeWishfulFixtures,
  cleanTables,
  seedWishfulTables,
  makeAuthHeader,
  seedUsers,
}
