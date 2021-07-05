const userRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User   = require('../models/user')

userRouter.get('/', async (request, response, next) => {
    const users =
        await User
            .find({})
            .populate('blogs', { title: 1, author: 1, url: 1, id: 1 })

    response.json(users.map(u => u.toJSON()))
})

userRouter.get('/:id', async (request, response, next) => {
    try {
        const user =
            await User
                .findById(request.params.id)
                .populate('blogs', { title: 1, author: 1, url: 1, id: 1 })

        if (user) {
            response.json(user.toJSON())
        } else {
            response.status(404).end()
        }

    } catch (exception) {
        next(exception)
    }
})

userRouter.post('/', async (request, response, next) => {
    try {
        const body = request.body

        if (!body.password) {
            return response.status(400).json({ error: 'password field is required' })
        }
        
        if (body.password.length < 3) {
            return response.status(400).json({ error: 'password should be at least 3 characters long' })
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

    } catch (exception) {
        next(exception)
    }
})


module.exports = userRouter
