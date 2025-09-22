import { configureStore } from '@reduxjs/toolkit'
import { valdoraApi } from './services/valdoraApi'
import { valdoraApiWithMocks } from './services/valdoraApiWithMocks'
import authSlice from './slices/authSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    [valdoraApi.reducerPath]: valdoraApi.reducer,
    [valdoraApiWithMocks.reducerPath]: valdoraApiWithMocks.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          valdoraApi.util.getRunningQueriesThunk.fulfilled,
          valdoraApiWithMocks.util.getRunningQueriesThunk.fulfilled,
        ],
      },
    })
    .concat(valdoraApi.middleware)
    .concat(valdoraApiWithMocks.middleware),
})

export default store
