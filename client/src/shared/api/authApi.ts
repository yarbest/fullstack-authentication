import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithReauth } from '@shared/api/baseQueryWithReauth'
import { AuthResponse } from '@shared/models'

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({

    register: builder.mutation<AuthResponse, { email: string, password: string }>({
      query: ({ email, password }) => ({
        url: `/register`,
        method: 'POST',
        body: { email, password },
      }),
    }),

    login: builder.mutation<AuthResponse, { email: string, password: string }>({
      query: ({ email, password }) => ({
        url: `/login`,
        method: 'POST',
        body: { email, password },
      }),
    }),

    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
    }),

    refreshTokens: builder.query<AuthResponse, void>({
      query: () => '/refresh',
    }),
  }),

})

export const {
  useLoginMutation,
  useRegisterMutation,
  useLazyRefreshTokensQuery,
  useRefreshTokensQuery,
  useLogoutMutation,
} = authApi
