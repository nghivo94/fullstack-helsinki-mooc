import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from './Blog'

const blog = {
  title: 'Canonical string reduction',
  author: 'Edsger W. Dijkstra',
  url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
  likes: 0,
  user: ''
}
const mockHandler = jest.fn()

describe('when rendering', () => {
  test('<Blog /> renders title and author of the blog', () => {
    const { container } = render(<Blog blog={blog} updateBlog={mockHandler} removeBlog={mockHandler}/>)
    const defaultInfoDiv = container.querySelector('.blog')
    expect(defaultInfoDiv).toHaveTextContent(`${blog.title} ${blog.author}`)
  })
  test('<Blog /> does not render URL or number of likes by default', () => {
    const { container } = render(<Blog blog={blog} updateBlog={mockHandler} removeBlog={mockHandler}/>)
    const hiddenInfoDiv = container.querySelector('.hiddenInfo')
    const urlDiv = container.querySelector('.url')
    const likesDiv = container.querySelector('.likes')

    expect(hiddenInfoDiv).toBeNull()
    expect(urlDiv).toBeNull()
    expect(likesDiv).toBeNull()
  })
})

test('<Blog /> shows url and nof.likes when controlling button is clicked', async () => {
  const { container } = render(<Blog blog={blog} updateBlog={mockHandler} removeBlog={mockHandler}/>)
  const user = userEvent.setup()
  const button  = screen.getByText('view')
  await user.click(button)

  const hiddenInfoDiv = container.querySelector('.hiddenInfo')
  const urlDiv = container.querySelector('.url')
  const likesDiv = container.querySelector('.likes')

  expect(hiddenInfoDiv).not.toBeNull()
  expect(urlDiv).not.toBeNull()
  expect(likesDiv).not.toBeNull()

  expect(urlDiv).toHaveTextContent(`${blog.url}`)
  expect(likesDiv).toHaveTextContent(`${blog.likes}`)
})

test('<Blog /> calls the handler function the correct nof.times when like button is clicked', async () => {
  render(<Blog blog={blog} updateBlog={mockHandler} removeBlog={mockHandler}/>)
  const showButton  = screen.getByText('view')
  const user = userEvent.setup()
  await user.click(showButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

