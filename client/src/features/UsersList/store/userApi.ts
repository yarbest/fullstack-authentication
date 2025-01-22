import { createApi } from '@reduxjs/toolkit/query/react'

import { baseQueryWithReauth } from '@shared/api/baseQueryWithReauth'
import { User } from '@shared/models'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
    }),
  }),

})

export const { useGetUsersQuery } = userApi
