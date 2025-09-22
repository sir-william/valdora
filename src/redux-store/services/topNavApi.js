/**
 * TopNav API Slice
 * Handles API calls for TopNav components (user, notifications, billing)
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { topNavMockService } from '../../@core/services/mockService'

// Check if mocks are enabled
const ENABLE_MOCKS = process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true'

// Base query configuration
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  prepareHeaders: (headers, { getState }) => {
    // Add JWT token for authentication
    const token = getState().auth?.accessToken || localStorage.getItem('token')
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('content-type', 'application/json')
    return headers
  },
})

// Mock query function
const mockQuery = async (endpoint, options = {}) => {
  console.log(`[MOCK] TopNav API: ${endpoint}`, options)
  
  switch (endpoint) {
    case '/me':
      return await topNavMockService.getCurrentUser()
    
    case '/me/profile':
      if (options.method === 'PUT') {
        return await topNavMockService.updateUserProfile(options.body)
      }
      break
    
    case '/me/preferences':
      if (options.method === 'PUT') {
        return await topNavMockService.updateUserPreferences(options.body)
      }
      break
    
    case '/notifications':
      if (options.method === 'GET') {
        return await topNavMockService.getNotifications(options.params)
      }
      break
    
    case '/notifications/mark-all-read':
      if (options.method === 'PATCH') {
        return await topNavMockService.markAllNotificationsAsRead()
      }
      break
    
    case '/billing/alerts':
      return await topNavMockService.getBillingAlerts()
    
    case '/auth/logout':
      if (options.method === 'POST') {
        return await topNavMockService.logout()
      }
      break
    
    default:
      // Handle dynamic endpoints
      const notificationReadMatch = endpoint.match(/^\/notifications\/(\d+)\/read$/)
      if (notificationReadMatch && options.method === 'PATCH') {
        const notificationId = parseInt(notificationReadMatch[1])
        return await topNavMockService.markNotificationAsRead(notificationId)
      }
      
      const notificationDeleteMatch = endpoint.match(/^\/notifications\/(\d+)$/)
      if (notificationDeleteMatch && options.method === 'DELETE') {
        const notificationId = parseInt(notificationDeleteMatch[1])
        return await topNavMockService.deleteNotification(notificationId)
      }
      
      const billingAlertMatch = endpoint.match(/^\/billing\/alerts\/(\d+)\/dismiss$/)
      if (billingAlertMatch && options.method === 'PATCH') {
        const alertId = parseInt(billingAlertMatch[1])
        return await topNavMockService.dismissBillingAlert(alertId)
      }
      
      throw new Error(`Mock endpoint not implemented: ${endpoint}`)
  }
}

// Create API slice
export const topNavApi = createApi({
  reducerPath: 'topNavApi',
  baseQuery: ENABLE_MOCKS ? 
    async (args, api, extraOptions) => {
      try {
        const result = await mockQuery(args.url || args, {
          method: args.method || 'GET',
          body: args.body,
          params: args.params
        })
        return { data: result }
      } catch (error) {
        return { error: { status: 500, data: error.message } }
      }
    } : 
    baseQuery,
  tagTypes: ['User', 'Notification', 'BillingAlert'],
  endpoints: (builder) => ({
    // User endpoints
    getCurrentUser: builder.query({
      query: () => '/me',
      providesTags: ['User'],
      transformResponse: (response) => ENABLE_MOCKS ? response.data : response
    }),
    
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: '/me/profile',
        method: 'PUT',
        body: profileData
      }),
      invalidatesTags: ['User'],
      transformResponse: (response) => ENABLE_MOCKS ? response.data : response
    }),
    
    updateUserPreferences: builder.mutation({
      query: (preferences) => ({
        url: '/me/preferences',
        method: 'PUT',
        body: preferences
      }),
      invalidatesTags: ['User'],
      transformResponse: (response) => ENABLE_MOCKS ? response.data : response,
      // Optimistic update for better UX
      async onQueryStarted(preferences, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          topNavApi.util.updateQueryData('getCurrentUser', undefined, (draft) => {
            Object.assign(draft, preferences)
          })
        )
        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      }
    }),

    // Notifications endpoints
    getNotifications: builder.query({
      query: (params = {}) => ({
        url: '/notifications',
        params
      }),
      providesTags: (result) => 
        result?.notifications
          ? [
              ...result.notifications.map(({ id }) => ({ type: 'Notification', id })),
              { type: 'Notification', id: 'LIST' }
            ]
          : [{ type: 'Notification', id: 'LIST' }],
      transformResponse: (response) => ENABLE_MOCKS ? response.data : response
    }),
    
    markNotificationAsRead: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: 'PATCH'
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: 'Notification', id: notificationId },
        { type: 'Notification', id: 'LIST' }
      ],
      transformResponse: (response) => ENABLE_MOCKS ? response.data : response
    }),
    
    markAllNotificationsAsRead: builder.mutation({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'PATCH'
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
      transformResponse: (response) => ENABLE_MOCKS ? response.data : response
    }),
    
    deleteNotification: builder.mutation({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, notificationId) => [
        { type: 'Notification', id: notificationId },
        { type: 'Notification', id: 'LIST' }
      ],
      transformResponse: (response) => ENABLE_MOCKS ? response.data : response
    }),

    // Billing endpoints
    getBillingAlerts: builder.query({
      query: () => '/billing/alerts',
      providesTags: [{ type: 'BillingAlert', id: 'LIST' }],
      transformResponse: (response) => ENABLE_MOCKS ? response.data : response
    }),
    
    dismissBillingAlert: builder.mutation({
      query: (alertId) => ({
        url: `/billing/alerts/${alertId}/dismiss`,
        method: 'PATCH'
      }),
      invalidatesTags: [
        { type: 'BillingAlert', id: 'LIST' },
        { type: 'User' } // Update user billing alerts count
      ],
      transformResponse: (response) => ENABLE_MOCKS ? response.data : response
    }),

    // Authentication endpoints
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      }),
      transformResponse: (response) => ENABLE_MOCKS ? response.data : response,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // Clear all cached data on logout
          dispatch(topNavApi.util.resetApiState())
        } catch (error) {
          console.error('Logout failed:', error)
        }
      }
    })
  })
})

// Export hooks for use in components
export const {
  useGetCurrentUserQuery,
  useUpdateUserProfileMutation,
  useUpdateUserPreferencesMutation,
  useGetNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
  useDeleteNotificationMutation,
  useGetBillingAlertsQuery,
  useDismissBillingAlertMutation,
  useLogoutMutation
} = topNavApi

// Export API slice for store configuration
export default topNavApi
