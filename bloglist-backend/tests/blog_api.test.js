const mongoose  = require('mongoose')
const supertest = require('supertest')
const Blog      = require('../models/blog')
const User      = require('../models/user')
const app       = require('../app')

const api = supertest(app)

let token = null

beforeAll(async () => {
    await User.deleteMany({})

    const initialUser = {
        username: 'root',
        name: 'root',
        password: 'sekret'
    }
    await api.post('/api/users').send(initialUser)

    const userForLogin = {
        username: 'root',
        password: 'sekret'
    }

    const response =
            await api
                .post('/api/login')
                .send(userForLogin)

    token = response.body.token
})

describe('when there is initially one blog in db', () => {

    const initialBlog = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 0,
    }

    let initialBlogId = ''

    beforeEach(async () => {
        await Blog.deleteMany({})

        const response = 
            await api
                .post('/api/blogs')
                .send(initialBlog)
                .set('Authorization', `bearer ${token}`)

        initialBlogId = response.body.id
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('correct amount of blogs is returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(1)
    })
    
    test('blogs\'s id-property is defined', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })

    test('a new blog can be added to database succesfully', async () => {
        const anotherBlog = {
            title: 'React patterns',
            author: 'Michael Chan',
            url: 'https://reactpatterns.com/',
            likes: 0
        }

        await api
            .post('/api/blogs')
            .send(anotherBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(2)
    })

    test('if property "likes" is missing, it defaults to zero', async () => {
        const anotherBlog = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        }

        const response = 
            await api
                .post('/api/blogs')
                .send(anotherBlog)
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/)

        expect(response.body.likes).toBe(0)
    })
    
    test('if property "title" is missing, should receive status code 400', async () => {
        const titleMissing = {
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        }

        await api
            .post('/api/blogs')
            .send(titleMissing)
            .set('Authorization', `bearer ${token}`)
            .expect(400)
    })
    
    test('if property "url" is missing, should receive status code 400', async () => {
        const urlMissing = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
        }

        await api
            .post('/api/blogs')
            .send(urlMissing)
            .set('Authorization', `bearer ${token}`)
            .expect(400)
    })

    test('the first blog can be succesfully removed with delete', async () => {
        await api
            .delete(`/api/blogs/${initialBlogId}`)
            .set('Authorization', `bearer ${token}`)
            .expect(204)

        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(0)
    })

    test('blog\'s likes can be succesfully updated with put', async () => {
        const likesUpdated = {
            ...initialBlog,
            likes: initialBlog.likes + 1,
        }

        const response1 =
            await api.put(`/api/blogs/${initialBlogId}`)
                .send(likesUpdated)
        expect(response1.body.likes)
            .toBe(initialBlog.likes + 1)

        const response2 = await api.get(`/api/blogs/${initialBlogId}`)
        expect(response2.body.likes)
            .toBe(initialBlog.likes + 1)
    })

})

afterAll(() => {
    mongoose.connection.close()
})

