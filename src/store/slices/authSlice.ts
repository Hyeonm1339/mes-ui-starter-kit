import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface User {
  userId: string
  userName: string
  role: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

const loadState = (): Partial<AuthState> => {
  try {
    const raw = localStorage.getItem('auth')
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

const saved = loadState()

const initialState: AuthState = {
  user: saved.user ?? null,
  accessToken: saved.accessToken ?? null,
  refreshToken: saved.refreshToken ?? null,
  isAuthenticated: !!saved.accessToken,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>,
    ) => {
      state.user = action.payload.user
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      localStorage.setItem(
        'auth',
        JSON.stringify({
          user: action.payload.user,
          accessToken: action.payload.accessToken,
          refreshToken: action.payload.refreshToken,
        }),
      )
    },
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      const saved = loadState()
      localStorage.setItem('auth', JSON.stringify({ ...saved, accessToken: action.payload }))
    },
    clearCredentials: (state) => {
      state.user = null
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      localStorage.removeItem('auth')
    },
  },
})

export const { setCredentials, updateAccessToken, clearCredentials } = authSlice.actions
