import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  tenant: null,
  permissions: [],
  roles: [],
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action) => {
      const { user, token, refreshToken, tenant, permissions, roles } = action.payload
      state.user = user
      state.token = token
      state.refreshToken = refreshToken
      state.tenant = tenant
      state.permissions = permissions || []
      state.roles = roles || []
      state.isAuthenticated = true
      state.isLoading = false
      state.error = null
    },
    loginFailure: (state, action) => {
      state.isLoading = false
      state.error = action.payload
      state.isAuthenticated = false
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.tenant = null
      state.permissions = []
      state.roles = []
      state.isAuthenticated = false
      state.isLoading = false
      state.error = null
    },
    refreshTokenSuccess: (state, action) => {
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload }
    },
    setTenant: (state, action) => {
      state.tenant = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  refreshTokenSuccess,
  updateUser,
  setTenant,
  clearError,
} = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectTenant = (state) => state.auth.tenant
export const selectPermissions = (state) => state.auth.permissions
export const selectRoles = (state) => state.auth.roles
