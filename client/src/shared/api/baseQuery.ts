import { fetchBaseQuery } from '@reduxjs/toolkit/query'

export const API_URL = import.meta.env.VITE_API_URL

export const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',

  // kind of "interceptor" for requests
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})
