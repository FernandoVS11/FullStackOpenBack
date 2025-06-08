import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import phonebookService from './services/phonebook'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    phonebookService.getAll().then(data => setPersons(data))
  }, [])

  const showMessage = (text, type = 'success') => {
    setNotification({ text, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleNameChange = e => setNewName(e.target.value)
  const handleNumberChange = e => setNewNumber(e.target.value)
  const handleFilterChange = e => setFilter(e.target.value)

  const addPerson = e => {
    e.preventDefault()
    const existingPerson = persons.find(
      p => p.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      )

      if (confirmUpdate) {
        const updatedPerson = { ...existingPerson, number: newNumber }

        phonebookService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(
              persons.map(p => (p.id !== existingPerson.id ? p : returnedPerson))
            )
            showMessage(`Updated ${returnedPerson.name}`)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.error(error)
            showMessage(
              `Information of ${existingPerson.name} has already been removed from server`,
              'error'
            )
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber
      }
    phonebookService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        showMessage(`Added ${returnedPerson.name}`)
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        console.error(error)
        showMessage(error.response?.data?.error || 'Unknown error', 'error')
      })
    }
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      phonebookService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showMessage(`Deleted ${name}`)
        })
        .catch(error => {
          console.error(error)
          showMessage(`Information of ${name} was already removed`, 'error')
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification} />

      <Filter value={filter} onChange={handleFilterChange} />

      <h3>Add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        name={newName}
        number={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} onDelete={handleDelete} />
    </div>
  )
}

export default App
