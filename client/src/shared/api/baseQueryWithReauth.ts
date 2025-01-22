import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { baseQuery } from '@shared/api/baseQuery'

import { authApi } from './authApi'

import { login, logout } from '../store/authSlice'

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)

  // "interceptor" for responses
  // exclude '/refresh' from reauth, otherwise it can be an infinite loop
  if (result.error && result.error.status === 401 && args !== '/refresh') {
    // forceRefetch prohibits caching
    const refreshResult = await api.dispatch(authApi.endpoints.refreshTokens.initiate(undefined, { forceRefetch: true }))

    if (refreshResult.data && refreshResult.isSuccess) {
      api.dispatch(login())
      localStorage.setItem('accessToken', refreshResult.data.accessToken)
      result = await baseQuery(args, api, extraOptions) // retry the initial query after getting new token
    }
    else {
      api.dispatch(logout())
      localStorage.removeItem('accessToken')
    }
  }

  return result
}
