const Person = (probs) => {
  return (
    <tr>
      <td>{probs.name}</td>
      <td>{probs.number}</td>
      <td><button onClick={probs.handleDelete}>delete</button></td>
    </tr>
  )
}

const Persons = (probs) => {
  return (
    <table>
      <tbody>
        {probs.persons.map(person => 
          <Person 
            key = {person.id} name = {person.name} number = {person.number} 
            handleDelete = {() => {probs.handleDelete(person.id)}}/>)}
      </tbody>
    </table>
  )
}

export default Persons