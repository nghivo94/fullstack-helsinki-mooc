import { useEffect, useState } from "react";

import countryService from "./services/countries"
import weatherService from "./services/weather";

import Search from "./components/Search"
import Countries from "./components/Countries"
import CountryInfo from "./components/CountryInfo"
import WeatherInfo from "./components/WeatherInfo"


const App = () => {

  const [newSearch, setNewSearch] = useState('')
  const [searchedCountries, setSearchedCountries] = useState([])
  const [shownCountry, setShownCountry] = useState('')
  const [weather, setWeather] = useState({})
  const [loadingSearch, setLoadingSearch] = useState(true)
  const [loadingWeather, setLoadingWeather] = useState(true)

  useEffect(() => {
    countryService
      .getAll()
      .then(response => {
        const newSearchedCountries = response.data
          .filter(country => country.name.common.toLowerCase().includes(newSearch.toLowerCase()))
          .map(country => {
            const processedCountry = {
              name: country.name.common,
              capital: country.capital ? country.capital[0] : undefined,
              area: country.area,
              languages: country.languages ? Object.keys(country.languages).map(key => country.languages[key]) : [],
              flag: country.flags.png
            }
            return processedCountry
          })
        setSearchedCountries(newSearchedCountries)
        setShownCountry(newSearchedCountries.length === 1 ? newSearchedCountries[0].name : '')
        setLoadingSearch(false)
      })
  }, [newSearch])

  useEffect(() => {
    const country = searchedCountries.filter(country => country.name === shownCountry)[0]
    if (country && country.capital) {
      weatherService
        .getGeo(country.capital)
        .then(response => {
          if (response.data) {
            const lat = response.data[0].lat
            const lon = response.data[0].lon
            weatherService
              .getWeather(lat, lon)
              .then(response => {
                const weatherData = response.data
                if (weatherData.length !== 0) {
                  setWeather({
                    country: shownCountry,
                    capital: country.capital,
                    temp: (weatherData.main.temp - 273.15).toFixed(2),
                    icon: weatherData.weather[0].icon,
                    windSpeed: weatherData.wind.speed
                  })
                }
                setLoadingWeather(false)
              })
          }
        })
    }
    else {
      setLoadingWeather(false)
    }
  }, [shownCountry])

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
    setLoadingSearch(true)
    setLoadingWeather(true)
  }

  const handleShow = (countryName) => {
    setShownCountry(countryName)
    setLoadingWeather(true)
  }

  return (
    <div>
      <Search newSearch = {newSearch} handleSearchChange = {handleSearchChange} />
      <div>
      {shownCountry ? 
        <div>
        {!loadingWeather ?
          <div>
            <CountryInfo country = {searchedCountries.filter(country => country.name === shownCountry)[0]} />
            {weather.country === shownCountry 
              && <WeatherInfo capital = {weather.capital} temp = {weather.temp} icon = {weather.icon} windSpeed = {weather.windSpeed}/>}
          </div> :
          <div>Loading...</div>
        }
        </div> :
        <div>
        {!loadingSearch ?
          <Countries 
            countries = {searchedCountries} 
            handleShow = {handleShow}/> :
            <div>Loading...</div>
        }
        </div>
      }
      </div>
    </div>
  )
}

export default App;
