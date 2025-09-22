import { configureStore } from '@reduxjs/toolkit'
import { valdoraApi } from './services/valdoraApi'
import { valdoraApiWithMocks } from './services/valdoraApiWithMocks'
import { userRolePermissionApi } from './services/userRolePermissionApi'
import { topNavApi } from './services/topNavApi'
import authSlice from './slices/authSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    [valdoraApi.reducerPath]: valdoraApi.reducer,
    [valdoraApiWithMocks.reducerPath]: valdoraApiWithMocks.reducer,
    [userRolePermissionApi.reducerPath]: userRolePermissionApi.reducer,
    [topNavApi.reducerPath]: topNavApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          valdoraApi.util.getRunningQueriesThunk.fulfilled,
          valdoraApiWithMocks.util.getRunningQueriesThunk.fulfilled,
          userRolePermissionApi.util.getRunningQueriesThunk.fulfilled,
          topNavApi.util.getRunningQueriesThunk.fulfilled,
        ],
      },
    })
    .concat(valdoraApi.middleware)
    .concat(valdoraApiWithMocks.middleware)
    .concat(userRolePermissionApi.middleware)
    .concat(topNavApi.middleware),
})

export default store
