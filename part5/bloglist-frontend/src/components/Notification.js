import PropTypes from 'prop-types'

const Notification = ({ message, isError }) => {
  const generalStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const errorStyle = { ...generalStyle, color: 'red' }

  if (!message) {
    return null
  }

  return (
    <div className='message' style={isError ? errorStyle : generalStyle}>{message}</div>
  )
}

Notification.propTypes = {
  message: PropTypes.string,
  isError: PropTypes.bool
}

export default Notification