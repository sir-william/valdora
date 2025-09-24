'use client'

import { Box, useTheme, useMediaQuery } from '@mui/material'
import { useState } from 'react'
import ResponsiveSidebar from '../navigation/ResponsiveSidebar'
import TopNav from './TopNav'

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
        {/* Top Navigation */}
        <TopNav 
          onMobileMenuToggle={handleDrawerToggle}
          drawerWidth={drawerWidth}
          collapsed={collapsed}
          isMobile={isMobile}
        />

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
