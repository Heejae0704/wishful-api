const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Comments Endpoints', function() {
    let db

    const {
      testUsers,
      testPredictions,
      testRevelations,
      testComments,
      testLikes
    } = helpers.makeWishfulFixtures()
  
    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
      })
    
      after('disconnect from db', () => db.destroy())
    
      before('cleanup', () => helpers.cleanTables(db))
    
      afterEach('cleanup', () => helpers.cleanTables(db))

      beforeEach('insert tables', () => {
        return helpers.seedWishfulTables(
            db,
            testUsers,
            testPredictions,
            testRevelations,
            testComments,
            testLikes
          )
  
    })

      describe(`GET /api/comments`, () => {

        it('responds with 200 and all of the comments', () => {
            const expectedComments = testComments.map(r => {
                return {
                    ...r, commented_at: r.commented_at.toString(), user_id: r.user_id, prediction_id: r.prediction_id}
            })

            return supertest(app)
              .get('/api/comments')
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(200, expectedComments)
          })
      })

      describe(`POST /api/revelations`, () => {


      afterEach('cleanup', () => helpers.cleanTables(db))
    
        it(`creates a comment, responding with 201 and the new comment`, function() {
          this.retries(3)
          const testUser = testUsers[0]
          const testPrediction = testPredictions[0]
          const newComment = {
            content: 'Ok fine',
            user_id: testUser.id,
            prediction_id: testPrediction.id,
            commented_at: new Date()

          }
          return supertest(app)
            .post('/api/comments')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .send(newComment)
            .expect(201)
            .expect(res => {
              expect(res.body).to.have.property('id')
              expect(res.body.content).to.eql(newComment.content)
              expect(res.body.user_id).to.eql(newComment.user_id)
              expect(res.body.prediction_id).to.eql(newComment.prediction_id)
              const expectedDate = newComment.commented_at.toString()
              const actualDate = res.body.commented_at
              expect(actualDate).to.eql(expectedDate)
            })

        })
    })
})
