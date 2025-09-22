'use client'

import { Box, AppBar, Toolbar, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useState } from 'react'
import ResponsiveSidebar from '../navigation/ResponsiveSidebar'

const DRAWER_WIDTH = 280
const DRAWER_WIDTH_COLLAPSED = 64

const ResponsiveLayout = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleToggleCollapse = (newCollapsed) => {
    setCollapsed(newCollapsed)
  }

  const drawerWidth = collapsed && !isMobile ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <ResponsiveSidebar 
        mobileOpen={mobileOpen} 
        onMobileClose={handleDrawerToggle}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
          transition: 'margin 0.3s ease-in-out, width 0.3s ease-in-out'
        }}
      >
        {/* Top AppBar */}
        <AppBar 
          position="fixed" 
          sx={{ 
            width: { md: `calc(100% - ${drawerWidth}px)` }, 
            ml: { md: `${drawerWidth}px` },
            backgroundColor: 'background.paper',
            color: 'text.primary',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            transition: 'margin 0.3s ease-in-out, width 0.3s ease-in-out',
            zIndex: theme.zIndex.drawer - 1
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              VALDORA - Navigation Dynamique Responsive
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                ✅ Système Actif
              </Typography>
              
              {!isMobile && (
                <Typography variant="caption" color="text.secondary">
                  {collapsed ? 'Mode Compact' : 'Mode Étendu'}
                </Typography>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ 
          pt: 8, 
          p: 3,
          transition: 'padding 0.3s ease-in-out'
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  )
}

export default ResponsiveLayout
