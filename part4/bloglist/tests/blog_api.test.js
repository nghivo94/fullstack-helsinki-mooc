const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
const testHelper = require('./test_helper')

describe('when there are initially some users saved and some notes saved for 1 user', () => {
  beforeEach(async () => {

    await User.deleteMany({})
    const passwordHashPromises = testHelper.initialUsers.map(user => bcrypt.hash(user.password, 10))
    const passwordHashes = await Promise.all(passwordHashPromises)

    const userObjects = []

    for (let i = 0; i < testHelper.initialUsers.length; i ++ ) {
      userObjects.push( new User ({
        username: testHelper.initialUsers[i].username,
        name: testHelper.initialUsers[i].name,
        passwordHash: passwordHashes[i]
      }))
    }

    const userPromises = userObjects.map(user => user.save())
    await Promise.all(userPromises)
    
    await Blog.deleteMany({})
    const userWithBlogs = await testHelper.userWithBlogs()

    const blogObjects = []
    testHelper.initialBlogs.forEach(blog => blogObjects.push( new Blog({
      ...blog, user: userWithBlogs._id
    })))
    const blogPromises = blogObjects.map(blog => blog.save())
    await Promise.all(blogPromises)
  })

  describe('creation of a new user', () => {  
    test('succeeds with a fresh username', async () => {
      const usersAtStart = await testHelper.usersInDb()

      await api
        .post('/api/users')
        .send(testHelper.validNewUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await testHelper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(testHelper.validNewUser.username)
    })

    test('fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await testHelper.usersInDb()

      const result = await api
        .post('/api/users')
        .send(testHelper.nonUniqueUsernameNewUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('expected `username` to be unique')

      const usersAtEnd = await testHelper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('fails with proper statuscode and message if username is missing', async () => {
      const usersAtStart = await testHelper.usersInDb()

      const result = await api
        .post('/api/users')
        .send(testHelper.missingUsernameNewUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('username is required!')

      const usersAtEnd = await testHelper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('fails with proper statuscode and message if username has fewer that 3 characters', async () => {
      const usersAtStart = await testHelper.usersInDb()

      const result = await api
        .post('/api/users')
        .send(testHelper.shortUsernameNewUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('username must have at least 3 characters!')

      const usersAtEnd = await testHelper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('fails with proper statuscode and message if password is missing', async () => {
      const usersAtStart = await testHelper.usersInDb()

      const result = await api
        .post('/api/users')
        .send(testHelper.missingPasswordNewUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('password is required!')

      const usersAtEnd = await testHelper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('fails with proper statuscode and message if password has fewer that 3 characters', async () => {
      const usersAtStart = await testHelper.usersInDb()

      const result = await api
        .post('/api/users')
        .send(testHelper.shortPasswordNewUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      expect(result.body.error).toContain('password must have at least 3 characters!')

      const usersAtEnd = await testHelper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
  })

  describe('login with username and password', () => {
    test('succeeds with valid username and password', async () => {
      const user = testHelper.validLogin
      const result = await api
        .post('/api/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)
      
      expect(result.body.username).toBe(user.username)
      expect(result.body.name).toBe(testHelper.initialUsers[1].name)
    })

    test('fails with invalid username', async () => {
      const invalidLogin = testHelper.invalidUsernameLogin
      const result = await api
        .post('/api/login')
        .send(invalidLogin)
        .expect(401)
      
      expect(result.body.error).toContain("invalid username or password!")
    })

    test('fails with invalid password', async () => {
      const invalidLogin = testHelper.invalidPasswordLogin
      const result = await api
        .post('/api/login')
        .send(invalidLogin)
        .expect(401)
      
      expect(result.body.error).toContain("invalid username or password!")
    })
  })

  describe('when accessing blogs', () => {
    test('blogs are returned as json', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
  
    test('all blogs are returned', async () => {
      const response = await api.get('/api/blogs')
  
      expect(response.body).toHaveLength(testHelper.initialBlogs.length)
      
      const titles = response.body.map(blog => blog.title)
      testHelper.initialBlogs.forEach(blog => {
        expect(titles).toContain(blog.title)
      })
    })
  
    test('a specific blog is within the returned blogs', async () => {
      const response = await api.get('/api/blogs')
  
      const titles = response.body.map(blog => blog.title)
      expect(titles).toContain(
        testHelper.initialBlogs[2].title
      )
    })
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data (with likes) and token', async () => {

      const validToken = await testHelper.generateValidToken()
      await api
        .post('/api/blogs')
        .send(testHelper.validNewBlog)
        .set({authorization: `Bearer ${validToken}`})
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length + 1)

      const titles = blogsAtEnd.map(blog => blog.title)
      expect(titles).toContain(testHelper.validNewBlog.title)
    })

    test('succeeds with valid data (with no likes) and token', async () => {

      const validToken = await testHelper.generateValidToken()
      const result = await api
        .post('/api/blogs')
        .send(testHelper.validNoLikesNewBlog)
        .set({authorization: `Bearer ${validToken}`})
        .expect(201)
        .expect('Content-Type', /application\/json/)

      expect(result.body.likes).toBe(0)
      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length + 1)
  
      const titles = blogsAtEnd.map(blog => blog.title)
      expect(titles).toContain(testHelper.validNoLikesNewBlog.title)
    })
  
    test('fails with proper statuscode and message if title is missing', async () => {

      const validToken = await testHelper.generateValidToken()
      const result = await api
        .post('/api/blogs')
        .send(testHelper.missingTitleNewBlog)
        .set({authorization: `Bearer ${validToken}`})
        .expect(400)

      expect(result.body.error).toContain('title is missing')
      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
    })
  
    test('fails with proper statuscode and message if url is missing', async () => {

      const validToken = await testHelper.generateValidToken()
      const result = await api
        .post('/api/blogs')
        .send(testHelper.missingURLNewBlog)
        .set({authorization: `Bearer ${validToken}`})
        .expect(400)

      expect(result.body.error).toContain('url is missing')
      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
    })

    test('fails with proper statuscode and message if token is invalid', async () => {

      const invalidToken = await testHelper.generateInvalidToken()
      await api
        .post('/api/blogs')
        .send(testHelper.missingURLNewBlog)
        .set({authorization: `Bearer ${invalidToken}`})
        .expect(400)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with statuscode 204 with valid id and token', async () => {

      const validToken = await testHelper.generateValidToken()
      const blogsAtStart = await testHelper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({authorization: `Bearer ${validToken}`})
        .expect(204)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length - 1)
      expect(blogsAtEnd).not.toContainEqual(blogToDelete)
    })

    test('fails with status code 400 with invalid token', async () => {

      const invalidToken = await testHelper.generateInvalidToken()
      const blogsAtStart = await testHelper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({authorization: `Bearer ${invalidToken}`})
        .expect(400)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
      expect(blogsAtEnd).toContainEqual(blogToDelete)
    })

    test('fails with proper statuscode and message if token is mismatched', async () => {

      const mismatchedToken = await testHelper.generateMismatchedToken()
      const blogsAtStart = await testHelper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      const result = await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set({authorization: `Bearer ${mismatchedToken}`})
        .expect(401)

      expect(result.body.error).toContain('invalid token')
      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
      expect(blogsAtEnd).toContainEqual(blogToDelete)
    })
  })

  describe('updating a blog', () => {

    test('succeeds with valid data', async () => {

      const validToken = await testHelper.generateValidToken()
      const blogsAtStart = await testHelper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      blogToUpdate.likes = blogToUpdate.likes + 1

      const resultBlog = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .set({authorization: `Bearer ${validToken}`})
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultBlog.body.title).toEqual(blogToUpdate.title)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
      expect(blogsAtEnd).toContainEqual(blogToUpdate)
    })

    test('fails with status code 400 with invalid token', async () => {

      const invalidToken = await testHelper.generateInvalidToken()
      const blogsAtStart = await testHelper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      blogToUpdate.likes = blogToUpdate.likes + 1

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set({authorization: `Bearer ${invalidToken}`})
        .expect(400)

      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
      expect(blogsAtEnd).not.toContainEqual(blogToUpdate)
    })

    test('fails with proper statuscode and message if token is mismatched', async () => {

      const mismatchedToken = await testHelper.generateMismatchedToken()
      const blogsAtStart = await testHelper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]
      blogToUpdate.likes = blogToUpdate.likes + 1

      const result = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set({authorization: `Bearer ${mismatchedToken}`})
        .expect(401)

      expect(result.body.error).toContain('invalid token')
      const blogsAtEnd = await testHelper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(testHelper.initialBlogs.length)
      expect(blogsAtEnd).not.toContainEqual(blogToUpdate)
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})