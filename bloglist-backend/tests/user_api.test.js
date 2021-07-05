const mongoose  = require('mongoose')
const supertest = require('supertest')
const helper    = require('../utils/test_helper')
const User      = require('../models/user')
const app       = require('../app')

const api = supertest(app)

describe('when is initially one user in database', () => {

    beforeEach(async () => {
        await User.deleteMany({})
        const user = new User({ username: 'root', password: 'sekret' })
        await user.save()
    })

    test('a new user can be succesfully added to database', async () => {
        const newUser = {
            username: 'paavo',
            name: 'Paavo',
            password: '123'
        }

        await api.post('/api/users').send(newUser).expect(200)
        const users = await helper.usersInDb()

        expect(users.map(u => u.username)).toContain('paavo')
        expect(users.length).toBe(2)
    })
    
    test('missing password field should return status code 400', async () => {
        const passwdMissing = {
            username: 'paavo',
            name: 'Paavo',
        }

        await api.post('/api/users').send(passwdMissing).expect(400)
    })
    
    test('missing username field should return status code 400', async () => {
        const missingUsername = {
            name: 'Paavo',
            password: '123'
        }

        await api.post('/api/users').send(missingUsername).expect(400)
    })

    test('password has to be at least 3 characters long. If not, receive status code 400.', async () => {
        const passwdTooShort = {
            username: 'paavo',
            name: 'Paavo',
            password: '12'
        }

        const expectedMessage = 'password should be at least 3 characters long'

        const response = await api.post('/api/users').send(passwdTooShort).expect(400)
        expect(response.body.error).toEqual(expectedMessage)
    })
    
    test('username has to be at least 3 characters long. If not, receive status code 400.', async () => {
        const usernameTooShort = {
            username: 'pa',
            name: 'Paavo',
            password: '123'
        }

        const expectedMessage = 'User validation failed: username: Path `username` (`pa`) is shorter than the minimum allowed length (3).'

        const response = await api.post('/api/users').send(usernameTooShort).expect(400)
        expect(response.body.error).toEqual(expectedMessage)
    })

})

afterAll(() => {
    mongoose.connection.close()
})

