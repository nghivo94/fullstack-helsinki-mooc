import { useEffect, useState } from 'react'

import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [shownPersons, setShownPersons] = useState(persons)
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState({})

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
        setShownPersons(response.data)
      })
    }, [])

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = persons.find(person => person.name === newName)
        personService
          .update(updatedPerson.id, {...updatedPerson, number : newNumber})
          .then(response => {
            const newPersons  = persons.map(person => person.id !== updatedPerson.id ? person : response.data)
            const newShownPersons = newPersons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
            setPersons(newPersons)
            setShownPersons(newShownPersons)
            setNewName('')
            setNewNumber('')
            setNotification({message : `Updated ${updatedPerson.name}'s number`})
            setTimeout(() => {
              setNotification({})
            }, 5000)
          })
          .catch(error => {
            const newPersons  = persons.filter(person => person.id !== updatedPerson.id)
            const newShownPersons = newPersons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
            setPersons(newPersons)
            setShownPersons(newShownPersons)
            setNotification({message: `Information of ${updatedPerson.name} has already been removed from the server.`, isError: true})
            setTimeout(() => {
              setNotification({})
            }, 5000)
          })
      }
    }
    else {
      const newPerson = {
        name: newName,
        number: newNumber
      }

      personService
        .create(newPerson)
        .then(response => {
          const newPersons = [...persons, response.data]
          const newShownPersons = newPersons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
          setPersons(newPersons)
          setShownPersons(newShownPersons)
          setNewName('')
          setNewNumber('')
          setNotification({message : `Added ${newPerson.name}`})
          setTimeout(() => {
            setNotification({})
          }, 5000)
        })
    }
  }

  const deletePerson = (id) => {
    const deletedPerson = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${deletedPerson.name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          const newPersons = persons.filter(person => person.id !== id)
          const newShownPersons = newPersons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
          setPersons(newPersons)
          setShownPersons(newShownPersons)
          setNotification({message : `Deleted ${deletedPerson.name}`})
          setTimeout(() => {
            setNotification({})
          }, 5000)
        })
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
      <Notification message = {notification.message} isError = {notification.isError}/>
      <Filter filter = {filter} handleFilterChange = {handleFilterChange}/>
      <h2>Add a new</h2>
      <PersonForm addPerson = {addPerson} newName = {newName} handleNameChange ={handleNameChange} 
                  newNumber = {newNumber} handleNumberChange = {handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons = {shownPersons} handleDelete = {deletePerson}/>
    </div>
  )
}

export default App