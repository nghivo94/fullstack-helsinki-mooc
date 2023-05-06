import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ( { login } ) => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    login({
      username: username,
      password: password
    })
    setUsername('')
    setPassword('')
  }
  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
                    username:
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={(e) => setUsername(e.target.value)}/>
        </div>
        <div>
                    password:
          <input
            id='password'
            type="text"
            value={password}
            name="Password"
            onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

export default LoginForm