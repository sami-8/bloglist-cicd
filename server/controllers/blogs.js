const blogRouter = require('express').Router()
const ApplicationError = require('../utils/application-error')
const jwt  = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (request, response) => {
  const blogs =
    await Blog
      .find({})
      .populate('user', { username: 1, name: 1, id: 1 })

  response.json(blogs.map(b => b.toJSON()))
})

blogRouter.get('/:id', async (request, response) => {
  const { id } = request.params
  const blog = await Blog.findById(id)

  if (!blog) {
    throw new ApplicationError(
      `Blog with id "${id}" does not exist.`,
      404
    )
  }
  response.json(blog.toJSON())
})

blogRouter.post('/', async (request, response) => {
  const { body, token } = request

  const decodedToken = jwt.verify(token, process.env.SECRET)

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
})


blogRouter.delete('/:id', async (request, response) => {
  const { token } = request

  const decodedToken = jwt.verify(token, process.env.SECRET)

  const user = await User.findById(decodedToken.id)
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== user.id.toString()) {
    throw new ApplicationError('Unauthorized', 401)
  }

  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const { title, author, url, likes } = request.body
  const blog = { title, author, url, likes }

  const updatedBlog = await Blog.findByIdAndUpdate(id, blog, { new: true })
  response.json(updatedBlog.toJSON())
})

module.exports = blogRouter

