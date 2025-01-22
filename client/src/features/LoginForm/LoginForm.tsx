import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { paths } from '@routes/paths'
import { useLoginMutation, useRegisterMutation } from '@shared/api/authApi'
import Button from '@shared/components/Button'

import LoginAndRegisterStatus from './components/LoginAndRegisterStatus'
import styles from './LoginForm.module.scss'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, { isLoading: isLoginLoading, error: loginError, reset: resetLoginError }] = useLoginMutation()
  const [register, { isLoading: isRegisterLoading, error: registerError, reset: resetRegisterError }] = useRegisterMutation()

  const navigate = useNavigate()

  const handleRegister = useCallback(async () => {
    try {
      resetLoginError()
      const { accessToken } = await register({ email, password }).unwrap()

      // without unwrap, in order to check if everything was successful
      // I'd need to check for field 'error' in result, unwrap throws error if there is one
      navigate(paths.users)
      localStorage.setItem('accessToken', accessToken)
    }
    catch (err) {
      console.error('Registration failed:', err)
      localStorage.removeItem('accessToken')
    }
  }, [email, password, register, resetLoginError, navigate])

  const handleLogin = useCallback(async () => {
    try {
      resetRegisterError()
      const { accessToken } = await login({ email, password }).unwrap()
      localStorage.setItem('accessToken', accessToken)
      navigate(paths.users)
    }
    catch (err) {
      console.error('Login failed:', err)
      localStorage.removeItem('accessToken')
    }
  }, [email, password, login, resetRegisterError, navigate])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Auth Page</h1>

      <div>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          className={styles.input}
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="text"
          id="email"
          name="email"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <label htmlFor="password" className={styles.label}>Password</label>
        <input
          className={styles.input}
          value={password}
          onChange={e => setPassword(e.target.value)}
          type="text"
          id="password"
          name="password"
          placeholder="Enter your password"
        />
      </div>

      <div className={styles.buttonsWrapper}>
        <Button
          className={styles.button}
          onClick={handleLogin}
          text="Login"
          isLoading={isLoginLoading}
        />
        <Button
          className={styles.button}
          onClick={handleRegister}
          text="Register"
          isLoading={isRegisterLoading}
        />
      </div>

      {(loginError ?? registerError)
      && (
        <LoginAndRegisterStatus
          isLoginLoading={isLoginLoading}
          isRegisterLoading={isRegisterLoading}
          loginError={loginError}
          registerError={registerError}
        />
      )}
    </div>
  )
}

export default LoginForm
