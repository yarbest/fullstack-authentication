import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useLazyRefreshTokensQuery } from '@shared/api/authApi'

import { paths } from './paths'

import { useAppSelector } from '../store'

interface PrivateRouteProps {
  children: React.ReactNode
}
const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation()
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const [refreshTokens, { isFetching, isSuccess, isError }] = useLazyRefreshTokensQuery()

  useEffect(() => {
    const triggerRefreshTokens = async () => {
      try {
        const { accessToken } = await refreshTokens().unwrap()
        localStorage.setItem('accessToken', accessToken)
      }
      catch (e) {
        console.log(e)
      }
    }

    if (!isLoggedIn) triggerRefreshTokens()
  }, [isLoggedIn, refreshTokens])

  if (isFetching) {
    return <div>Loading...</div>
  }

  if ((!isLoggedIn && isSuccess) || isError) {
    return <Navigate to={paths.login} state={location} replace />
  }

  return (
    <>
      {children}
    </>
  )
}

export default PrivateRoute
