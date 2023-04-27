const Notification = (probs) => {
  const generalStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const errorStyle = {...generalStyle, color: 'red'}

  if (!probs.message) {
    return null
  }

  return (
    <div style={probs.isError ? errorStyle : generalStyle}>{probs.message}</div>
  )
}

export default Notification