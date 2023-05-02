const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)
const testHelper = require('./test_helper')

describe('when there is initially some notes saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(testHelper.initialBlogs)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(testHelper.initialBlogs.length)
    
    const blogs = response.body.map(blog => testHelper.extractBlogInfo(blog))
    testHelper.initialBlogs.forEach(blog => {
      expect(blogs).toContainEqual(blog)
    })
  })

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const blogs = response.body.map(blog => testHelper.extractBlogInfo(blog))
    expect(blogs).toContainEqual(
      testHelper.initialBlogs[2]
    )
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data (with likes)', async () => {

      await api
        .post('/api/blogs')
        .send(testHelper.validNewBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length + 1)

      const blogs = blogsAtEnd.map(blog => testHelper.extractBlogInfo(blog))
      expect(blogs).toContainEqual(testHelper.validNewBlog)
    })

    test('succeeds with valid data (with no likes)', async () => {

      await api
        .post('/api/blogs')
        .send(testHelper.validNoLikesNewBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length + 1)

      const blogs = blogsAtEnd.map(blog => testHelper.extractBlogInfo(blog))
      expect(blogs).toContainEqual({...testHelper.validNoLikesNewBlog, likes: 0})
    })

    test('fails with status code 400 if data invalid (missing title)', async () => {

      await api
        .post('/api/blogs')
        .send(testHelper.missingTitleNewBlog)
        .expect(400)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
    })

    test('fails with status code 400 if data invalid (missing url)', async () => {
      
      await api
        .post('/api/blogs')
        .send(testHelper.missingURLNewBlog)
        .expect(400)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await testHelper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length - 1)
      
      const blogs = blogsAtEnd.map(blog => testHelper.extractBlogInfo(blog))
      expect(blogs).not.toContainEqual(testHelper.extractBlogInfo(blogToDelete))
    })
  })

  describe('updating a blog', () => {

    test('succeeds with valid data', async () => {
      const blogsAtStart = await testHelper.blogsInDb()

      const blogToUpdate = blogsAtStart[0]
      blogToUpdate.likes = blogToUpdate.likes + 1

      const resultBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(testHelper.extractBlogInfo(resultBlog.body)).toEqual(testHelper.extractBlogInfo(blogToUpdate))

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
      expect(blogsAtEnd).toContainEqual(blogToUpdate)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})