import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export interface Tab {
  path: string
  labelKey: string
}

interface TabState {
  tabs: Tab[]
  activeTabPath: string
}

const initialState: TabState = {
  tabs: [],
  activeTabPath: '',
}

export const tabSlice = createSlice({
  name: 'tab',
  initialState,
  reducers: {
    openTab: (state, action: PayloadAction<Tab>) => {
      const { path, labelKey } = action.payload
      const exists = state.tabs.some((t) => t.path === path)
      if (!exists) {
        state.tabs.push({ path, labelKey })
      }
      state.activeTabPath = path
    },
    closeTab: (state, action: PayloadAction<string>) => {
      const closedPath = action.payload
      const index = state.tabs.findIndex((t) => t.path === closedPath)
      if (index === -1) return
      state.tabs.splice(index, 1)
      if (state.activeTabPath === closedPath) {
        const next = state.tabs[index - 1] ?? state.tabs[index] ?? null
        state.activeTabPath = next?.path ?? ''
      }
    },
    setActiveTab: (state, action: PayloadAction<string>) => {
      state.activeTabPath = action.payload
    },
  },
})

export const { openTab, closeTab, setActiveTab } = tabSlice.actions
