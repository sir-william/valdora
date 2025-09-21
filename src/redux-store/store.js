import { configureStore } from '@reduxjs/toolkit'
import { valdoraApi } from './services/valdoraApi'
import authSlice from './slices/authSlice'
import uiSlice from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    ui: uiSlice,
    [valdoraApi.reducerPath]: valdoraApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [valdoraApi.util.getRunningQueriesThunk.fulfilled],
      },
    }).concat(valdoraApi.middleware),
})

export default store
