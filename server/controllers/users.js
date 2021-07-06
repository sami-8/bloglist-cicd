const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const ApplicationError = require('../utils/application-error')

userRouter.get('/', async (request, response) => {
  const users =
    await User
      .find({})
      .populate('blogs', { title: 1, author: 1, url: 1, id: 1 })

  response.json(users.map(u => u.toJSON()))
})

userRouter.get('/:id', async (request, response) => {
  const { id } = request.params
  const user =
    await User
      .findById(id)
      .populate('blogs', { title: 1, author: 1, url: 1, id: 1 })

  if (!user) {
    throw new ApplicationError(
      `User with id "${id}" does not exist.`,
      404
    )
  }

  response.json(user.toJSON())
})

userRouter.post('/', async (request, response) => {
  const { body } = request

  if (!body.password) {
    throw new ApplicationError(
      'Password field is required.',
      400
    )
  }

  if (body.password.length < 3) {
    throw new ApplicationError(
      'Password should be at least 3 characters long.',
      400
    )
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()
  response.json(savedUser)
})

module.exports = userRouter
