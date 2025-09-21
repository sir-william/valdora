import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import {
  selectAuth,
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectTenant,
  selectPermissions,
  selectRoles,
  logout,
  refreshTokenSuccess,
} from '../../redux-store/slices/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  
  const auth = useSelector(selectAuth)
  const user = useSelector(selectUser)
  const token = useSelector(selectToken)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const tenant = useSelector(selectTenant)
  const permissions = useSelector(selectPermissions)
  const roles = useSelector(selectRoles)

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    if (!permissions || permissions.length === 0) return false
    return permissions.includes(permission)
  }, [permissions])

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    if (!roles || roles.length === 0) return false
    return roles.includes(role)
  }, [roles])

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roleList) => {
    if (!roles || roles.length === 0) return false
    return roleList.some(role => roles.includes(role))
  }, [roles])

  // Check if user has all specified permissions
  const hasAllPermissions = useCallback((permissionList) => {
    if (!permissions || permissions.length === 0) return false
    return permissionList.every(permission => permissions.includes(permission))
  }, [permissions])

  // Refresh token
  const refreshToken = useCallback(async () => {
    try {
      if (!auth.refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: auth.refreshToken,
        }),
      })

      if (!response.ok) {
        throw new Error('Token refresh failed')
      }

      const data = await response.json()
      
      dispatch(refreshTokenSuccess({
        token: data.token,
        refreshToken: data.refreshToken,
      }))

      return data.token
    } catch (error) {
      console.error('Token refresh error:', error)
      dispatch(logout())
      router.push('/auth/login')
      throw error
    }
  }, [auth.refreshToken, dispatch, router])

  // Logout function
  const handleLogout = useCallback(async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.warn('Logout API call failed:', error)
    } finally {
      dispatch(logout())
      router.push('/auth/login')
    }
  }, [dispatch, router, token])

  // Check if token is expired
  const isTokenExpired = useCallback(() => {
    if (!token) return true
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      return true
    }
  }, [token])

  // Auto refresh token when it's about to expire
  useEffect(() => {
    if (!isAuthenticated || !token) return

    const checkTokenExpiry = () => {
      if (isTokenExpired()) {
        refreshToken().catch(() => {
          // Token refresh failed, user will be logged out
        })
      }
    }

    // Check token expiry every 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000)

    // Check immediately
    checkTokenExpiry()

    return () => clearInterval(interval)
  }, [isAuthenticated, token, isTokenExpired, refreshToken])

  // Redirect to login if not authenticated
  const requireAuth = useCallback((redirectTo = '/auth/login') => {
    if (!isAuthenticated) {
      router.push(redirectTo)
      return false
    }
    return true
  }, [isAuthenticated, router])

  // Require specific permission
  const requirePermission = useCallback((permission, redirectTo = '/unauthorized') => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return false
    }
    
    if (!hasPermission(permission)) {
      router.push(redirectTo)
      return false
    }
    
    return true
  }, [isAuthenticated, hasPermission, router])

  // Require specific role
  const requireRole = useCallback((role, redirectTo = '/unauthorized') => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return false
    }
    
    if (!hasRole(role)) {
      router.push(redirectTo)
      return false
    }
    
    return true
  }, [isAuthenticated, hasRole, router])

  return {
    // State
    user,
    token,
    isAuthenticated,
    tenant,
    permissions,
    roles,
    isLoading: auth.isLoading,
    error: auth.error,

    // Permission checks
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAllPermissions,

    // Actions
    logout: handleLogout,
    refreshToken,
    
    // Utilities
    isTokenExpired,
    requireAuth,
    requirePermission,
    requireRole,
  }
}
