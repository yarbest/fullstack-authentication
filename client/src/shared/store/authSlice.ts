import { createSlice } from '@reduxjs/toolkit'

import { authApi } from '@shared/api/authApi'

export interface AuthState {
  isLoggedIn: boolean
}

export const initialState: AuthState = {
  isLoggedIn: false,
}

export const authSlice = createSlice({
  name: 'authSlice',
  initialState,
  reducers: {
    login: (state) => {
      state.isLoggedIn = true
    },

    logout: (state) => {
      state.isLoggedIn = false
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state) => {
      state.isLoggedIn = true
    })
    builder.addMatcher(authApi.endpoints.refreshTokens.matchFulfilled, (state) => {
      state.isLoggedIn = true
    })
    builder.addMatcher(authApi.endpoints.register.matchFulfilled, (state) => {
      state.isLoggedIn = true
    })

    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
      state.isLoggedIn = false
    })
  },
})

export const { login, logout } = authSlice.actions
export const authReducer = authSlice.reducer
