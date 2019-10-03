const express = require('express')
const UsersService = require('./users-service')
const { requireAuth } = require('../middleware/jwt-auth')
const path = require('path')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    UsersService.getAllUsers(req.app.get('db'))
      .then(users => {
        res.json(users.map(UsersService.serializeUser))
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { password, user_name, full_name, email } = req.body
    console.log(req.body)

    for (const field of ['full_name', 'email', 'user_name', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })
      
      // const passwordError = UsersService.validatePassword(password)

      // if (passwordError)
      //   return res.status(400).json({ error: passwordError })

      UsersService.hasUserWithUserName(
        req.app.get('db'),
        user_name
      )
        .then(hasUserWithUserName => {
          if (hasUserWithUserName)
            return res.status(400).json({ error: `Username already taken`})

          return UsersService.hasUserWithEmail(
            req.app.get('db'),
            email
          )
            .then(hasUserWithEmail => {
              if (hasUserWithEmail)
                return res.status(400).json({ error: `Email already taken`})
              
              return UsersService.hashPassword(password) 
              .then(hashedPassword => {

                const newUser = {
                  user_name,
                  password: hashedPassword,
                  full_name,
                  email,
                }

                return UsersService.insertUser(
                  req.app.get('db'),
                  newUser
                )
                .then(user => {
                  res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(UsersService.serializeUser(user))
                })

              })
          })
        })

        .catch(next)
  })
  

  module.exports = usersRouter