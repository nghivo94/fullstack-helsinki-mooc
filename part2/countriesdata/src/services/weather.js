import axios from "axios";

const api_key = process.env.REACT_APP_API_KEY
const weatherURL = "https://api.openweathermap.org/data/2.5/weather?"
const geoURL = "http://api.openweathermap.org/geo/1.0/direct?"

const getGeo = (cityName) => {
  return axios.get(`${geoURL}q=${cityName}&appid=${api_key}`)  
}

const getWeather = (lat, lon) => {
  return axios.get(`${weatherURL}lat=${lat}&lon=${lon}&appid=${api_key}`)
}

export default { getGeo, getWeather }