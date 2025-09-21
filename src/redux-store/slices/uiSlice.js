import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // Theme settings
  mode: 'light', // 'light' | 'dark'
  primaryColor: '#7367F0',
  
  // Layout settings
  sidebarOpen: true,
  sidebarCollapsed: false,
  
  // Loading states
  globalLoading: false,
  
  // Notifications
  notifications: [],
  
  // Modals
  modals: {},
  
  // Breadcrumbs
  breadcrumbs: [],
  
  // Page settings
  pageTitle: '',
  
  // Language
  language: 'fr',
  
  // Responsive
  isMobile: false,
  isTablet: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Theme actions
    setMode: (state, action) => {
      state.mode = action.payload
    },
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload
    },
    
    // Layout actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    toggleSidebarCollapsed: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action) => {
      state.sidebarCollapsed = action.payload
    },
    
    // Loading actions
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        type: 'info',
        autoHide: true,
        duration: 5000,
        ...action.payload,
      }
      state.notifications.push(notification)
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    // Modal actions
    openModal: (state, action) => {
      const { modalId, props } = action.payload
      state.modals[modalId] = { open: true, props: props || {} }
    },
    closeModal: (state, action) => {
      const modalId = action.payload
      if (state.modals[modalId]) {
        state.modals[modalId].open = false
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modalId) => {
        state.modals[modalId].open = false
      })
    },
    
    // Breadcrumb actions
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload
    },
    addBreadcrumb: (state, action) => {
      state.breadcrumbs.push(action.payload)
    },
    
    // Page actions
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload
    },
    
    // Language actions
    setLanguage: (state, action) => {
      state.language = action.payload
    },
    
    // Responsive actions
    setDeviceType: (state, action) => {
      const { isMobile, isTablet } = action.payload
      state.isMobile = isMobile
      state.isTablet = isTablet
    },
  },
})

export const {
  // Theme actions
  setMode,
  setPrimaryColor,
  
  // Layout actions
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarCollapsed,
  setSidebarCollapsed,
  
  // Loading actions
  setGlobalLoading,
  
  // Notification actions
  addNotification,
  removeNotification,
  clearNotifications,
  
  // Modal actions
  openModal,
  closeModal,
  closeAllModals,
  
  // Breadcrumb actions
  setBreadcrumbs,
  addBreadcrumb,
  
  // Page actions
  setPageTitle,
  
  // Language actions
  setLanguage,
  
  // Responsive actions
  setDeviceType,
} = uiSlice.actions

export default uiSlice.reducer

// Selectors
export const selectUI = (state) => state.ui
export const selectMode = (state) => state.ui.mode
export const selectPrimaryColor = (state) => state.ui.primaryColor
export const selectSidebarOpen = (state) => state.ui.sidebarOpen
export const selectSidebarCollapsed = (state) => state.ui.sidebarCollapsed
export const selectGlobalLoading = (state) => state.ui.globalLoading
export const selectNotifications = (state) => state.ui.notifications
export const selectModals = (state) => state.ui.modals
export const selectBreadcrumbs = (state) => state.ui.breadcrumbs
export const selectPageTitle = (state) => state.ui.pageTitle
export const selectLanguage = (state) => state.ui.language
export const selectIsMobile = (state) => state.ui.isMobile
export const selectIsTablet = (state) => state.ui.isTablet
