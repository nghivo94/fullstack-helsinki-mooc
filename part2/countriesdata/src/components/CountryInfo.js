const CountryInfo = (probs) => {
  const country = probs.country  
  return (
    <div>
      <h1>{country.name}</h1>
      {country.capital && <div>capital {country.capital}</div>}
      {country.area && <div>area {country.area}</div>}
      {country.languages && 
      <div>
        <h3>languages: </h3>
        <ul>
        {country.languages.map(language => <li key = {language}>{language}</li>)}
        </ul>
      </div>}
      {country.flag && <img src={country.flag}></img>}
  </div>
  )  
}

export default CountryInfo