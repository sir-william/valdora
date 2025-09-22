'use client'

import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useState } from 'react'
import SimpleSidebar from '../navigation/SimpleSidebar'

const DRAWER_WIDTH = 280

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <SimpleSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          backgroundColor: 'background.default',
          minHeight: '100vh'
        }}
      >
        {/* Top AppBar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` }, 
            ml: { sm: `${DRAWER_WIDTH}px` },
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleSidebar}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              VALDORA - Navigation Auto-Détection
            </Typography>
            <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
              ✅ Système Actif
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ pt: 8, p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout
