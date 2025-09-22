'use client'

import { useState, useEffect } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  Badge,
  Box,
  Avatar,
  Divider,
  Chip
} from '@mui/material'
import {
  Person as PersonIcon,
  Settings as SettingsIcon,
  CreditCard as BillingIcon,
  AttachMoney as PricingIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  Circle as OnlineIcon
} from '@mui/icons-material'

// Mock user data (will be replaced with API calls)
const MOCK_USER = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: 'Administrator',
  avatarUrl: null,
  status: 'online',
  billingAlerts: 4 // Number of billing notifications
}

const UserMenu = () => {
  const [user, setUser] = useState(MOCK_USER)
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // Load user data on mount (in real app, this would be an API call)
  useEffect(() => {
    // Simulate loading user data
    // const userData = await fetchUserData()
    // setUser(userData)
  }, [])

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      // Telemetry
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'nav.user.logout')
      }

      // In real app, make POST request to logout endpoint
      // await fetch('/auth/logout', { method: 'POST' })
      
      // Clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // Redirect to login
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
    
    handleMenuClose()
  }

  // Handle menu item clicks
  const handleMenuItemClick = (path, telemetryEvent) => {
    if (telemetryEvent && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', telemetryEvent)
    }
    
    window.location.href = path
    handleMenuClose()
  }

  // Generate avatar
  const getAvatarContent = () => {
    if (user.avatarUrl) {
      return <Avatar src={user.avatarUrl} sx={{ width: 32, height: 32 }} />
    }
    
    const initials = user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
    
    return (
      <Avatar sx={{ 
        width: 32, 
        height: 32, 
        backgroundColor: 'primary.main',
        fontSize: '0.875rem',
        fontWeight: 'bold'
      }}>
        {initials}
      </Avatar>
    )
  }

  return (
    <>
      <Tooltip title={`${user.name} (${user.status})`} arrow>
        <IconButton
          onClick={handleMenuOpen}
          size="medium"
          aria-label="User menu"
          aria-haspopup="menu"
          aria-expanded={open}
          sx={{
            p: 0.5,
            '&:hover': {
              backgroundColor: 'action.hover'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <Box sx={{ position: 'relative' }}>
            {getAvatarContent()}
            {user.status === 'online' && (
              <OnlineIcon
                sx={{
                  position: 'absolute',
                  bottom: -2,
                  right: -2,
                  fontSize: 12,
                  color: 'success.main',
                  backgroundColor: 'background.paper',
                  borderRadius: '50%'
                }}
              />
            )}
          </Box>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 280,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        {/* User Info Header */}
        <Box sx={{ px: 2, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ position: 'relative' }}>
              {getAvatarContent()}
              {user.status === 'online' && (
                <OnlineIcon
                  sx={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    fontSize: 12,
                    color: 'success.main',
                    backgroundColor: 'background.paper',
                    borderRadius: '50%'
                  }}
                />
              )}
            </Box>
            
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.email}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                <Chip
                  label={user.role}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
                <Chip
                  label={user.status}
                  size="small"
                  color="success"
                  variant="filled"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Menu Items */}
        <MenuItem
          onClick={() => handleMenuItemClick('/profile')}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>

        <MenuItem
          onClick={() => handleMenuItemClick('/settings')}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </MenuItem>

        <MenuItem
          onClick={() => handleMenuItemClick('/billing', 'nav.user.billing_opened')}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <BillingIcon />
          </ListItemIcon>
          <ListItemText primary="Billing" />
          {user.billingAlerts > 0 && (
            <Badge
              badgeContent={user.billingAlerts}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: '0.7rem',
                  minWidth: 16,
                  height: 16
                }
              }}
            />
          )}
        </MenuItem>

        <MenuItem
          onClick={() => handleMenuItemClick('/pricing')}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <PricingIcon />
          </ListItemIcon>
          <ListItemText primary="Pricing" />
        </MenuItem>

        <MenuItem
          onClick={() => handleMenuItemClick('/help')}
          sx={{ py: 1.5 }}
        >
          <ListItemIcon>
            <HelpIcon />
          </ListItemIcon>
          <ListItemText primary="FAQ" />
        </MenuItem>

        <Divider sx={{ my: 1 }} />

        {/* Logout */}
        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.light',
              color: 'error.contrastText'
            }
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: 'inherit' }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>

        {/* Footer */}
        <Box sx={{ px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontSize: '0.7rem' }}
          >
            Last login: {new Date().toLocaleDateString()}
          </Typography>
        </Box>
      </Menu>
    </>
  )
}

export default UserMenu
