import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

let token = null

const setToken = (newToken) => {
  if (newToken === null) {
    return token = null
  }
  token = `Bearer ${newToken}`
}

const create = async newObject => {
  const config = {
    headers: { authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

const remove = async id => {
  const config = {
    headers: { authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, setToken, update, remove }