'use client'

import { useState, useEffect } from 'react'
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Badge } from '@mui/material'
import { Menu, Notifications, Search, Settings } from '@mui/icons-material'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import { useAuth } from '../../hooks/useAuth'
import { isFeatureEnabled } from '../../utils/config'

const SIDEBAR_WIDTH = 280
const SIDEBAR_COLLAPSED_WIDTH = 64

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user } = useAuth()

  // Responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const sidebarWidth = sidebarOpen ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      {isFeatureEnabled('sidebar') && (
        <Sidebar open={sidebarOpen} onToggle={handleSidebarToggle} />
      )}

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          ml: isFeatureEnabled('sidebar') ? 0 : 0,
          transition: theme => theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Top AppBar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'text.primary',
            width: isFeatureEnabled('sidebar') 
              ? `calc(100% - ${sidebarWidth}px)` 
              : '100%',
            ml: isFeatureEnabled('sidebar') ? `${sidebarWidth}px` : 0,
            transition: theme => theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            {/* Left side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!isFeatureEnabled('sidebar') && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleSidebarToggle}
                >
                  <Menu />
                </IconButton>
              )}
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Typography
                  variant="h6"
                  component="h1"
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                  }}
                >
                  Dashboard VALDORA
                </Typography>
              </motion.div>
            </Box>

            {/* Right side */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Search */}
              <IconButton
                color="inherit"
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <Search />
              </IconButton>

              {/* Notifications */}
              {isFeatureEnabled('notifications') && (
                <IconButton
                  color="inherit"
                  sx={{
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <Badge badgeContent={5} color="error" variant="dot">
                    <Notifications />
                  </Badge>
                </IconButton>
              )}

              {/* Settings */}
              <IconButton
                color="inherit"
                sx={{
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <Settings />
              </IconButton>

              {/* User Avatar */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: 'primary.main',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        transition: 'transform 0.2s ease-in-out',
                      },
                    }}
                  >
                    {user.name?.charAt(0) || 'U'}
                  </Avatar>
                </motion.div>
              )}
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            backgroundColor: 'background.default',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            style={{ height: '100%' }}
          >
            {children}
          </motion.div>
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout
