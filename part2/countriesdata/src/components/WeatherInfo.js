const imgURL = "https://openweathermap.org/img/wn/"

const WeatherInfo = (probs) => {
  return (
    <div>
      <h2>Weather in {probs.capital}</h2>
      <div>temperature {probs.temp} Celcius</div>
      <img src={`${imgURL}${probs.icon}@2x.png`} alt="weather icon" />
      <div>wind {probs.windSpeed} m/s</div>
    </div>
  )  
}

export default WeatherInfo