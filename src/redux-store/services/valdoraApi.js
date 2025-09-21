import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const valdoraApi = createApi({
  reducerPath: 'valdoraApi',
  baseQuery,
  tagTypes: [
    'AiStoreDraft',
    'Order',
    'Product',
    'Category',
    'Customer',
    'Tenant',
    'User',
    'Plan',
    'Subscription',
    'CashCollection',
    'DeliveryRequest',
    'Courier',
    'CustomerRiskProfile',
    'OrderFraudCheck',
    'MerchantPayout'
  ],
  endpoints: (builder) => ({
    // AI Store Draft endpoints
    getAiStoreDrafts: builder.query({
      query: (params = {}) => ({
        url: '/ai_store_drafts',
        params,
      }),
      providesTags: ['AiStoreDraft'],
    }),
    getAiStoreDraft: builder.query({
      query: (id) => `/ai_store_drafts/${id}`,
      providesTags: (result, error, id) => [{ type: 'AiStoreDraft', id }],
    }),
    createAiStoreDraft: builder.mutation({
      query: (draft) => ({
        url: '/ai_store_drafts',
        method: 'POST',
        body: draft,
      }),
      invalidatesTags: ['AiStoreDraft'],
    }),
    updateAiStoreDraft: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/ai_store_drafts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'AiStoreDraft', id }],
    }),
    deleteAiStoreDraft: builder.mutation({
      query: (id) => ({
        url: `/ai_store_drafts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AiStoreDraft'],
    }),

    // Order endpoints
    getOrders: builder.query({
      query: (params = {}) => ({
        url: '/orders',
        params,
      }),
      providesTags: ['Order'],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: '/orders',
        method: 'POST',
        body: order,
      }),
      invalidatesTags: ['Order'],
    }),
    updateOrder: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),

    // Product endpoints
    getProducts: builder.query({
      query: (params = {}) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Product'],
    }),
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),

    // Customer endpoints
    getCustomers: builder.query({
      query: (params = {}) => ({
        url: '/v1/merchant/customers',
        params,
      }),
      providesTags: ['Customer'],
    }),
    getCustomer: builder.query({
      query: (id) => `/v1/merchant/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),

    // Category endpoints
    getCategories: builder.query({
      query: (params = {}) => ({
        url: '/categories',
        params,
      }),
      providesTags: ['Category'],
    }),

    // Cash Collection endpoints
    getCashCollections: builder.query({
      query: (params = {}) => ({
        url: '/cash_collections',
        params,
      }),
      providesTags: ['CashCollection'],
    }),

    // Delivery endpoints
    getDeliveryRequests: builder.query({
      query: (params = {}) => ({
        url: '/v1/merchant/delivery-requests',
        params,
      }),
      providesTags: ['DeliveryRequest'],
    }),

    // Risk Management endpoints
    getCustomerRiskProfiles: builder.query({
      query: (params = {}) => ({
        url: '/customer_risk_profiles',
        params,
      }),
      providesTags: ['CustomerRiskProfile'],
    }),

    // Financial endpoints
    getMerchantPayouts: builder.query({
      query: (params = {}) => ({
        url: '/merchant_payouts',
        params,
      }),
      providesTags: ['MerchantPayout'],
    }),
  }),
})

export const {
  // AI Store Draft hooks
  useGetAiStoreDraftsQuery,
  useGetAiStoreDraftQuery,
  useCreateAiStoreDraftMutation,
  useUpdateAiStoreDraftMutation,
  useDeleteAiStoreDraftMutation,

  // Order hooks
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,

  // Product hooks
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,

  // Customer hooks
  useGetCustomersQuery,
  useGetCustomerQuery,

  // Category hooks
  useGetCategoriesQuery,

  // Cash Collection hooks
  useGetCashCollectionsQuery,

  // Delivery hooks
  useGetDeliveryRequestsQuery,

  // Risk Management hooks
  useGetCustomerRiskProfilesQuery,

  // Financial hooks
  useGetMerchantPayoutsQuery,
} = valdoraApi
