const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const userExtractor = require('../utils/middleware').userExtractor

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
    response.json(blogs)
})
  
blogsRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body

    const user = request.user
    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user.id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {

    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (blog && !(blog.user.toString() === user.id.toString())) {
        return response.status(401).json({ error: 'invalid token' })
    }
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const body = {... request.body, likes: request.body.likes || 0}
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, body, { new : true, runValidators: true })
    response.json(updatedBlog)
})

module.exports = blogsRouter