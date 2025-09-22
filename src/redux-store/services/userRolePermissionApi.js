/**
 * RTK Query API slice for User Role & Permission management
 * Handles all CRUD operations for Users, Roles, and Permissions
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockService } from '../../@core/services/mockService'

// Base query with mock fallback
const baseQueryWithMocks = async (args, api, extraOptions) => {
  const enableMocks = process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true'
  
  if (enableMocks) {
    // Mock implementation
    const { url, method = 'GET', body } = args
    const urlParts = url.split('/')
    const resource = urlParts[2] // users, roles, permissions
    const id = urlParts[3]
    const action = urlParts[4]
    
    try {
      switch (method) {
        case 'GET':
          if (id && action) {
            // Special actions like /users/1/roles
            return { data: await mockService[`get${resource.slice(0, -1).charAt(0).toUpperCase() + resource.slice(1, -1)}${action.charAt(0).toUpperCase() + action.slice(1)}`](id) }
          } else if (id) {
            // Single resource
            return await mockService[`get${resource.slice(0, -1).charAt(0).toUpperCase() + resource.slice(1, -1)}`](id)
          } else {
            // Collection
            const params = new URLSearchParams(args.params || {})
            const queryParams = Object.fromEntries(params.entries())
            return await mockService[`get${resource.charAt(0).toUpperCase() + resource.slice(1)}`](queryParams)
          }
        
        case 'POST':
          if (action) {
            // Special actions like /users/1/roles
            return await mockService[`assign${action.slice(0, -1).charAt(0).toUpperCase() + action.slice(1, -1)}To${resource.slice(0, -1).charAt(0).toUpperCase() + resource.slice(1, -1)}`](id, body.id)
          } else {
            // Create
            return await mockService[`create${resource.slice(0, -1).charAt(0).toUpperCase() + resource.slice(1, -1)}`](body)
          }
        
        case 'PUT':
        case 'PATCH':
          return await mockService[`update${resource.slice(0, -1).charAt(0).toUpperCase() + resource.slice(1, -1)}`](id, body)
        
        case 'DELETE':
          if (action) {
            // Remove association like /users/1/roles/2
            const actionId = urlParts[5]
            return await mockService[`remove${action.slice(0, -1).charAt(0).toUpperCase() + action.slice(1, -1)}From${resource.slice(0, -1).charAt(0).toUpperCase() + resource.slice(1, -1)}`](id, actionId)
          } else {
            // Delete
            return await mockService[`delete${resource.slice(0, -1).charAt(0).toUpperCase() + resource.slice(1, -1)}`](id)
          }
        
        default:
          throw new Error(`Unsupported method: ${method}`)
      }
    } catch (error) {
      return { error: { status: 'CUSTOM_ERROR', data: error.message } }
    }
  }
  
  // Real API implementation
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }
      headers.set('Content-Type', 'application/json')
      return headers
    },
  })
  
  return baseQuery(args, api, extraOptions)
}

export const userRolePermissionApi = createApi({
  reducerPath: 'userRolePermissionApi',
  baseQuery: baseQueryWithMocks,
  tagTypes: ['User', 'Role', 'Permission'],
  endpoints: (builder) => ({
    // ========== USER ENDPOINTS ==========
    getUsers: builder.query({
      query: (params = {}) => ({
        url: '/api/users',
        params,
      }),
      providesTags: ['User'],
    }),
    
    getUser: builder.query({
      query: (id) => `/api/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/api/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    
    updateUser: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/api/users/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }, 'User'],
    }),
    
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    
    assignRoleToUser: builder.mutation({
      query: ({ userId, roleId }) => ({
        url: `/api/users/${userId}/roles`,
        method: 'POST',
        body: { id: roleId },
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, 'User'],
    }),
    
    removeRoleFromUser: builder.mutation({
      query: ({ userId, roleId }) => ({
        url: `/api/users/${userId}/roles/${roleId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'User', id: userId }, 'User'],
    }),
    
    // ========== ROLE ENDPOINTS ==========
    getRoles: builder.query({
      query: (params = {}) => ({
        url: '/api/roles',
        params,
      }),
      providesTags: ['Role'],
    }),
    
    getRole: builder.query({
      query: (id) => `/api/roles/${id}`,
      providesTags: (result, error, id) => [{ type: 'Role', id }],
    }),
    
    createRole: builder.mutation({
      query: (roleData) => ({
        url: '/api/roles',
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: ['Role'],
    }),
    
    updateRole: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/api/roles/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Role', id }, 'Role'],
    }),
    
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `/api/roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role'],
    }),
    
    assignPermissionToRole: builder.mutation({
      query: ({ roleId, permissionId }) => ({
        url: `/api/roles/${roleId}/permissions`,
        method: 'POST',
        body: { id: permissionId },
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: 'Role', id: roleId }, 'Role'],
    }),
    
    removePermissionFromRole: builder.mutation({
      query: ({ roleId, permissionId }) => ({
        url: `/api/roles/${roleId}/permissions/${permissionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { roleId }) => [{ type: 'Role', id: roleId }, 'Role'],
    }),
    
    // ========== PERMISSION ENDPOINTS ==========
    getPermissions: builder.query({
      query: (params = {}) => ({
        url: '/api/permissions',
        params,
      }),
      providesTags: ['Permission'],
    }),
    
    getPermission: builder.query({
      query: (id) => `/api/permissions/${id}`,
      providesTags: (result, error, id) => [{ type: 'Permission', id }],
    }),
    
    createPermission: builder.mutation({
      query: (permissionData) => ({
        url: '/api/permissions',
        method: 'POST',
        body: permissionData,
      }),
      invalidatesTags: ['Permission'],
    }),
    
    updatePermission: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/api/permissions/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Permission', id }, 'Permission'],
    }),
    
    deletePermission: builder.mutation({
      query: (id) => ({
        url: `/api/permissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Permission'],
    }),
  }),
})

// Export hooks for usage in functional components
export const {
  // User hooks
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useAssignRoleToUserMutation,
  useRemoveRoleFromUserMutation,
  
  // Role hooks
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useAssignPermissionToRoleMutation,
  useRemovePermissionFromRoleMutation,
  
  // Permission hooks
  useGetPermissionsQuery,
  useGetPermissionQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} = userRolePermissionApi

export default userRolePermissionApi
