import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, showRemove, removeBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [show, setShow] = useState(false)
  const buttonLabel = show ? 'hide' : 'view'

  const toggleShow = () => {
    setShow(!show)
  }

  const handleLike = () => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    updateBlog(blog.id, updatedBlog)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove the blog "${blog.title}" by ${blog.author}?`)) {
      removeBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle} className='blog'> {blog.title} {blog.author}
      <button onClick={toggleShow}>{buttonLabel}</button>
      {show &&
      <div className='hiddenInfo'>
        <a href={blog.url} className='url'>{blog.url}</a>
        <div className='likes'>likes {blog.likes} <button className='like-button' onClick={handleLike}>like</button></div>
        <div>{blog.user.name}</div>
        {showRemove && <button onClick={handleRemove}>remove</button>}
      </div>}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  showRemove: PropTypes.bool,
  removeBlog: PropTypes.func.isRequired
}

export default Blog