const Persons = (probs) => {
  return (
    <div>
      {probs.persons.map(person => <div key = {person.id}>{person.name} {person.number}</div>)}
    </div>
  )
}

export default Persons