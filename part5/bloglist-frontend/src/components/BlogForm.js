import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

  const handleCreateBlog = (e) => {
    e.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setURL('')
  }

  return (
    <form onSubmit={handleCreateBlog}>
      <div>
                title:
        <input
          type="text"
          value={title}
          name="title"
          onChange={(e) => {setTitle(e.target.value)}}/>
      </div>
      <div>
                author:
        <input
          type="text"
          value={author}
          name="author"
          onChange={(e) => {setAuthor(e.target.value)}}/>
      </div>
      <div>
                url:
        <input
          type="text"
          value={url}
          name="url"
          onChange={(e) => {setURL(e.target.value)}}/>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm