import { useState, useEffect, useRef } from 'react'

import loginService from './services/login'
import blogService from './services/blogs'

import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Blog from './components/Blog'
import Togglable from './components/Togglable'

const App = () => {

  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const [user, setUser] = useState(null)

  const [blogs, setBlogs] = useState([])

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      const newBlogs = await blogService.getAll()
      newBlogs.sort(compareBlog)
      setBlogs(newBlogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    } else {
      blogService.setToken(null)
    }
  }, [user])

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage('')
        setIsError(false)
      }, 5000)
    }
  }, [message])

  const compareBlog = (blog1, blog2) => {
    if (blog1.likes < blog2.likes) {
      return 1
    }
    if (blog1.likes > blog2.likes) {
      return -1
    }
    return 0
  }

  const login = async (userObject) => {
    try {
      const user = await loginService.login(userObject)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUser(user)
    } catch (exception) {
      setMessage('Wrong credentials')
      setIsError(true)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const createBlog = async (blogObject) => {
    try {

      blogFormRef.current.toggleVisibility()
      const savedBlog = await blogService.create(blogObject)
      const savedBlogObject = { ...savedBlog,
        user: { username: user.username, name: user.name, id: savedBlog.user.id } }
      const newBlogs = blogs.concat(savedBlogObject)
      newBlogs.sort(compareBlog)
      setBlogs(newBlogs)

      setMessage(`Added a new Blog: "${savedBlog.title}" by ${savedBlog.author}`)
      setIsError(false)

    } catch (exception) {
      setMessage(exception.response.data.error)
      setIsError(true)
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)
      const updatedBlogObject = { ...updatedBlog,
        user: { username: user.username, name: user.name, id: updatedBlog.user.id } }
      const newBlogs = blogs.map(blog => blog.id === updatedBlog.id ? updatedBlogObject : blog)
      newBlogs.sort(compareBlog)
      setBlogs(newBlogs)
      setMessage(`${user.name} liked the blog "${updatedBlog.title}" by ${updatedBlog.author}`)
      setIsError(false)
    } catch (exception) {
      setMessage(exception.response.data.error)
      setIsError(true)
    }
  }

  const removeBlog = async id => {
    try {
      await blogService.remove(id)
      const deletedBlog = blogs.find(blog => blog.id === id)
      const newBlogs = blogs.filter(blog => blog.id !== id)
      newBlogs.sort(compareBlog)
      setBlogs(newBlogs)
      setMessage(`Removed the blog "${deletedBlog.title}" by ${deletedBlog.author}`)
      setIsError(false)
    } catch (exception) {
      setMessage(exception.response.data.error)
      setIsError(true)
    }
  }

  return (
    <div>
      <Notification isError = {isError} message = {message}/>
      {user === null ?
        <LoginForm login = {login}/> :
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel = "new blog" ref = {blogFormRef}>
            <BlogForm createBlog = {createBlog}/>
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateBlog={updateBlog} showRemove= {blog.user.username === user.username} removeBlog={removeBlog}/>
          )}
        </div>

      }
    </div>
  )
}

export default App