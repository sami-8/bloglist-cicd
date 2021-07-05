const blogRouter = require('express').Router()
const jwt  = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response, next) => {
    const blogs =
        await Blog
            .find({})
            .populate('user', { username: 1, name: 1, id: 1 })

    response.json(blogs.map(b => b.toJSON()))
})

blogRouter.get('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)

        if (blog) {
            response.json(blog.toJSON())
        } else {
            response.status(404).end()
        }

    } catch (exception) {
        next(exception)
    }
})

blogRouter.post('/', async (request, response, next) => {
    const body = request.body
    const token = request.token
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
            return response.status(401)
                .json({ error: 'token invalid or missing' })
        }

        const user = await User.findById(decodedToken.id)

        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes ? body.likes : 0,
            user: user._id
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(savedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
})


blogRouter.delete('/:id', async (request, response, next) => {
    const body = request.body
    const token = request.token

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)

        if (!token || !decodedToken.id) {
            return response.status(401)
                .json({ error: 'token invalid or missing' })
        }

        const user = await User.findById(decodedToken.id)
        const blog = await Blog.findById(request.params.id)

        if (blog.user.toString() !== user.id.toString()) {
            return response.status(401).json({ error: 'unauthorized' })
        }

        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

blogRouter.put('/:id', async (request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(updatedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogRouter

