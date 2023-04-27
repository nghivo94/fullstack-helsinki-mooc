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

export default PersonForm