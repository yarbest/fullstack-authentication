import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import styles from '../LoginForm.module.scss'

interface LoginAndRegisterStatusProps {
  isLoginLoading: boolean
  isRegisterLoading: boolean
  loginError?: FetchBaseQueryError | SerializedError
  registerError?: FetchBaseQueryError | SerializedError
}

const LoginAndRegisterStatus = ({
  isLoginLoading,
  loginError,
  isRegisterLoading,
  registerError,
}: LoginAndRegisterStatusProps) => {
  const getError = (prefix: string, error?: FetchBaseQueryError | SerializedError) => {
    if (!error) return null
    if ('error' in error) return prefix + error.error
    else if ('message' in error) return prefix + error.message
    else if ('data' in error) return prefix + JSON.stringify(error.data)
    return 'An error occurred'
  }

  return (
    <div>
      <p className={styles.errorMessage}>
        <br />
        {getError('Error during Login: ', loginError)}
        <br />
        {getError('Error during Register: ', registerError)}
      </p>

      {isLoginLoading && <div>Login Loading...</div>}
      {isRegisterLoading && <div>Register Loading...</div>}
    </div>
  )
}

export default LoginAndRegisterStatus
