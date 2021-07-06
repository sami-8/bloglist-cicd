const mongoose  = require('mongoose')
const bcrypt    = require('bcrypt')
const supertest = require('supertest')
const helper    = require('../utils/test_helper')
const User      = require('../models/user')
const app       = require('../../app')

const api = supertest(app)

describe('when is initially one user in database', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({
      username: 'root',
      name: 'root',
      passwordHash: await bcrypt.hash('sekret', 10)
    })
    await user.save()
  })

  test('a new user can be successfully added to database', async () => {
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

    await api
      .post('/api/users')
      .send(passwdMissing)
      .expect(400)
      .expectErrorMessage('Password field is required.')
  })

  test('missing name field should return status code 400', async () => {
    const passwdMissing = {
      username: 'paavo',
      password: '123',
    }
    const expectedMessage =
      'User validation failed: name: Path `name` is required.'

    await api
      .post('/api/users')
      .send(passwdMissing)
      .expect(400)
      .expectErrorMessage(expectedMessage)
  })

  test('missing username field should return status code 400', async () => {
    const missingUsername = {
      name: 'Paavo',
      password: '123'
    }

    const expectedMessage =
      'User validation failed: username: Path `username` is required.'

    await api.post('/api/users')
      .send(missingUsername)
      .expect(400)
      .expectErrorMessage(expectedMessage)
  })

  test('password has to be at least 3 characters long. If not, receive status code 400.', async () => {
    const passwdTooShort = {
      username: 'paavo',
      name: 'Paavo',
      password: '12'
    }
    const expectedMessage = 'Password should be at least 3 characters long.'

    await api.post('/api/users')
      .send(passwdTooShort).expect(400)
      .expectErrorMessage(expectedMessage)
  })

  test('username has to be at least 3 characters long. If not, receive status code 400.', async () => {
    const usernameTooShort = {
      username: 'pa',
      name: 'Paavo',
      password: '123'
    }
    const expectedMessage = 'User validation failed: username: Path `username` (`pa`) is shorter than the minimum allowed length (3).'

    await api.post('/api/users')
      .send(usernameTooShort)
      .expect(400)
      .expectErrorMessage(expectedMessage)
  })

})

afterAll(() => {
  mongoose.connection.close()
})

