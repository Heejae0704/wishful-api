const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Revelations Endpoints', function() {
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

      describe(`GET /api/revelations`, () => {

        it('responds with 200 and all of the revelations', () => {
            const expectedRevelations = testRevelations.map(r => {
                return {
                    ...r, revealed_at: r.revealed_at.toString(), user_id: r.user_id.toString(), prediction_id: r.prediction_id.toString()}
            })

            return supertest(app)
              .get('/api/revelations')
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(200, expectedRevelations)
          })
      })

      describe(`POST /api/revelations`, () => {


      afterEach('cleanup', () => helpers.cleanTables(db))
    
        it(`creates a revelation, responding with 201 and the new revelation`, function() {
          this.retries(3)
          const testUser = testUsers[0]
          const testPrediction = testPredictions[0]
          const newRevelation = {
            revelation_text: 'Test happened',
            is_prediction_correct: true,
            evidence: 'https://www.google.com',
            user_id: testUser.id,
            prediction_id: testPrediction.id,
            revealed_at: new Date()

          }
          return supertest(app)
            .post('/api/revelations')
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .send(newRevelation)
            .expect(201)
            .expect(res => {
              expect(res.body).to.have.property('id')
              expect(res.body.revelation_text).to.eql(newRevelation.revelation_text)
              expect(res.body.is_prediction_correct).to.eql(newRevelation.is_prediction_correct)
              expect(res.body.evidence).to.eql(newRevelation.evidence)
              expect(res.body.user_id).to.eql(newRevelation.user_id.toString())
              expect(res.body.prediction_id).to.eql(newRevelation.prediction_id.toString())
              const expectedDate = newRevelation.revealed_at.toString()
              const actualDate = res.body.revealed_at
              expect(actualDate).to.eql(expectedDate)
            })

        })
    })
})
