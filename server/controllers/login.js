const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const ApplicationError = require('../utils/application-error')

loginRouter.post('/', async (request, response) => {
  const { body } = request

  const user = await User.findOne({ username: body.username })
  const passwdCorrect = user === null
    ? false
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwdCorrect)) {
    throw new ApplicationError(
      'Invalid username or password',
      401
    )
  }

  const payload = {
    username: user.username,
    id: user._id
  }
  const token = jwt.sign(payload, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name, id: user.id })
})

module.exports = loginRouter
