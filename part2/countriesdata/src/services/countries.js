import axios from 'axios'

const baseURL = "https://restcountries.com/v3.1/all"

const getAll = () => {
  return axios.get(baseURL)
}

export default {getAll}