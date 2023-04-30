const PersonForm = (probs) => {
  return (
    <form onSubmit={probs.addPerson}>
      <table>
        <tbody>
          <tr>
            <td>name: </td>
            <td><input value = {probs.newName} onChange={probs.handleNameChange}/></td>
          </tr>
          <tr>
            <td>number: </td>
            <td><input value = {probs.newNumber} onChange={probs.handleNumberChange}/></td>
          </tr>
        </tbody>
      </table>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm