const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Predictions Endpoints', function() {
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

      describe(`GET /api/predictions`, () => {

        beforeEach('insert tables', () => {
            return helpers.seedWishfulTables(
                db,
                testUsers,
                testPredictions,
                testRevelations,
                testComments,
                testLikes
              )
      
        }
      )

        it('responds with 200 and all of the predictions', () => {
            const expectedPredictions = testPredictions.map(p => {
                return {
                    ...p, created_at: p.created_at.toString()
                }
            })

            return supertest(app)
              .get('/api/predictions')
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(200, expectedPredictions)
          })
      })

      describe(`POST /api/predictions`, () => {

        beforeEach('insert users', () => 
        helpers.seedUsers(
            db,
            testUsers,
        ))
    
        it(`creates a prediction, responding with 201 and the new prediction`, function() {
          this.retries(3)
          const testUser = testUsers[0]
          const newPrediction = {
            prediction_who: 'Tester',
            prediction_what: 'test the system',
            prediction_when: 'now',
            prediction_commentary: 'just a test',
            created_by: testUser.user_name,
            created_at: new Date()

          }
          return supertest(app)
            .post('/api/predictions')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .send(newPrediction)
            .expect(201)
            .expect(res => {
              expect(res.body).to.have.property('id')
              expect(res.body.prediction_who).to.eql(newPrediction.prediction_who)
              expect(res.body.prediction_what).to.eql(newPrediction.prediction_what)
              expect(res.body.prediction_when).to.eql(newPrediction.prediction_when)
              expect(res.body.prediction_commentary).to.eql(newPrediction.prediction_commentary)
              expect(res.body.created_by).to.eql(newPrediction.created_by)
              const expectedDate = newPrediction.created_at.toString()
              const actualDate = res.body.created_at
              expect(actualDate).to.eql(expectedDate)
            })

        })
    })
})
