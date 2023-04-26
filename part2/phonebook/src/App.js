import { useState } from 'react'

const Filter = (probs) => {
  return (
    <div>filter shown with <input value = {probs.filter} onChange={probs.handleFilterChange}/></div>
  )
}

const PersonForm = (probs) => {
  return (
    <form onSubmit={probs.addPerson}>
      <div>name: <input value = {probs.newName} onChange={probs.handleNameChange}/></div>
      <div>number: <input value = {probs.newNumber} onChange={probs.handleNumberChange}/></div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = (probs) => {
  return (
    <div>
      {probs.persons.map(person => <div key = {person.id}>{person.name} {person.number}</div>)}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [shownPersons, setShownPersons] = useState(persons)
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.filter(person => person.name === newName).length === 1) {
      alert(`${newName} is already added to phonebook`)
    }
    else {
      const newPersons = [...persons, { name: newName , number : newNumber, id : persons.length + 1}]
      setPersons(newPersons)
      const newShownPersons = newPersons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
      setShownPersons(newShownPersons)
    }
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    const newShownPersons = persons.filter(person => person.name.toLowerCase().includes(event.target.value.toLowerCase()))
    setShownPersons(newShownPersons)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter = {filter} handleFilterChange = {handleFilterChange}/>
      <h2>Add a new</h2>
      <PersonForm addPerson = {addPerson} newName = {newName} handleNameChange ={handleNameChange} 
                  newNumber = {newNumber} handleNumberChange = {handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons = {shownPersons} />
    </div>
  )
}

export default App