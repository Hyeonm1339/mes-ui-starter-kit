import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from './slices/authSlice'
import { tabSlice } from './slices/tabSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    tab: tabSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
