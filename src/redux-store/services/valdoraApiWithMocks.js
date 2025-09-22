import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockService } from '../../@core/services/mockService'
import { config, logger } from '../../@core/utils/config'

// Base query avec support des mocks
const baseQueryWithMocks = async (args, api, extraOptions) => {
  const { endpoint } = args
  
  // Si les mocks sont activés, utiliser le service mock
  if (config.mocks.enabled) {
    logger.debug('Using mock service for:', endpoint)
    
    try {
      switch (endpoint) {
        case '/auth/login':
          return { data: await mockService.login(args.body) }
        case '/auth/logout':
          return { data: await mockService.logout() }
        case '/ai-store-drafts':
          if (args.method === 'POST') {
            return { data: await mockService.createAiStoreDraft(args.body) }
          }
          return { data: await mockService.getAiStoreDrafts() }
        case '/orders':
          return { data: await mockService.getOrders() }
        case '/analytics':
          return { data: await mockService.getAnalytics() }
        default:
          logger.warn('No mock implementation for:', endpoint)
          return { error: { status: 'MOCK_NOT_IMPLEMENTED', data: 'Mock not implemented for this endpoint' } }
      }
    } catch (error) {
      logger.error('Mock service error:', error)
      return { error: { status: 'MOCK_ERROR', data: error.message } }
    }
  }
  
  // Utiliser l'API réelle si les mocks sont désactivés
  const baseQuery = fetchBaseQuery({
    baseUrl: config.api.baseUrl + '/api/v1',
    timeout: config.api.timeout,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    },
  })
  
  return baseQuery(args, api, extraOptions)
}

export const valdoraApiWithMocks = createApi({
  reducerPath: 'valdoraApiWithMocks',
  baseQuery: baseQueryWithMocks,
  tagTypes: ['AiStoreDraft', 'Order', 'User', 'Analytics'],
  endpoints: (builder) => ({
    // Authentication
    login: builder.mutation({
      query: (credentials) => ({
        endpoint: '/auth/login',
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    logout: builder.mutation({
      query: () => ({
        endpoint: '/auth/logout',
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    
    // AI Store Drafts
    getAiStoreDrafts: builder.query({
      query: (params = {}) => ({
        endpoint: '/ai-store-drafts',
        url: '/ai-store-drafts',
        params,
      }),
      providesTags: ['AiStoreDraft'],
    }),
    
    createAiStoreDraft: builder.mutation({
      query: (data) => ({
        endpoint: '/ai-store-drafts',
        url: '/ai-store-drafts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AiStoreDraft'],
    }),
    
    // Orders
    getOrders: builder.query({
      query: (params = {}) => ({
        endpoint: '/orders',
        url: '/orders',
        params,
      }),
      providesTags: ['Order'],
    }),
    
    // Analytics
    getAnalytics: builder.query({
      query: (params = {}) => ({
        endpoint: '/analytics',
        url: '/analytics',
        params,
      }),
      providesTags: ['Analytics'],
    }),
  }),
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetAiStoreDraftsQuery,
  useCreateAiStoreDraftMutation,
  useGetOrdersQuery,
  useGetAnalyticsQuery,
} = valdoraApiWithMocks
