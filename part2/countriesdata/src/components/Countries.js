const Countries = (probs) => {
  if (probs.countries.length > 10) {
    return (
      <div>To many matches, specify another filter.</div>
    )
  }

  if (probs.countries.length === 0) {
    return (
      <div>Country not found.</div>
    )
  }

  return (
    <table>
      <tbody>
      {probs.countries.
        map(country => 
          <Country 
            key = {country.name} name = {country.name} 
            handleShow = {() => probs.handleShow(country.name)}/>)}
      </tbody>
    </table>
  )
}

const Country = (probs) => {
  return (
    <tr>
      <td>{probs.name}</td>
      <td><button onClick={probs.handleShow} >show</button></td>
    </tr>
  )
}

export default Countries