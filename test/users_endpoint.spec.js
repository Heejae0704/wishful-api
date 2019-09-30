const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Users Enpoints', function() {
    let db

    const { testUsers } = helpers.makeWishfulFixtures()
    const testUser = testUsers[0]

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

    describe(`POST /api/users`, () => {

        context(`Happy path`, () => {
            it(`responds 201, serialized user, storing bcryped password`, () => {
                const newUser = {
                    email: 'abc@abcd.com',
                    password: '11AAaa!!',
                    full_name: 'test full_name',
                    user_name: 'testuser',
                }
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.email).to.eql(newUser.email)
                        expect(res.body.user_name).to.eql(newUser.user_name)
                        expect(res.body).to.not.have.property('password')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    })
                    .expect(res => 
                        db
                            .from('wishful_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.user_name).to.eql(newUser.user_name)
                                expect(row.email).to.eql(newUser.email)

                                return bcrypt.compare(newUser.password, row.password)
                            })
                            .then(compareMatch => {
                                expect(compareMatch).to.be.true
                            })
                        )
            })
        })
    })
})