'use client'

import { useState, useEffect } from 'react'
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Tooltip,
  Paper
} from '@mui/material'
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Language as LanguageIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  SettingsBrightness as SystemModeIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  CreditCard as BillingIcon,
  AttachMoney as PricingIcon,
  Help as HelpIcon,
  Logout as LogoutIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material'

// Import sub-components (we'll create these next)
import ThemeToggle from './topnav/ThemeToggle'
import LanguageSelector from './topnav/LanguageSelector'
import NotificationsMenu from './topnav/NotificationsMenu'
import UserMenu from './topnav/UserMenu'
import SearchPalette from './topnav/SearchPalette'

const TopNav = ({ 
  onMobileMenuToggle, 
  drawerWidth = 280,
  collapsed = false,
  isMobile = false 
}) => {
  const theme = useTheme()
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'))
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null)

  // Handle keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null)
  }

  // Mobile overflow menu items
  const MobileMenu = (
    <Menu
      anchorEl={mobileMenuAnchor}
      open={Boolean(mobileMenuAnchor)}
      onClose={handleMobileMenuClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <MenuItem>
        <ListItemIcon><LanguageIcon /></ListItemIcon>
        <ListItemText primary="Language" />
      </MenuItem>
      <MenuItem>
        <ListItemIcon><DarkModeIcon /></ListItemIcon>
        <ListItemText primary="Theme" />
      </MenuItem>
    </Menu>
  )

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: { md: `calc(100% - ${drawerWidth}px)` }, 
          ml: { md: `${drawerWidth}px` },
          backgroundColor: '#fff',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          transition: 'margin 0.3s ease-in-out, width 0.3s ease-in-out',
          zIndex: theme.zIndex.drawer - 1,
          height: { xs: 56, md: 64 },
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)'
        }}
      >
        <Toolbar 
          sx={{ 
            minHeight: { xs: 56, md: 64 },
            px: { xs: 2, md: 3 },
            gap: { xs: 1, md: 2 }
          }}
        >
          {/* Brand Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Mobile Menu Toggle */}
            <IconButton
              color="inherit"
              aria-label="Toggle sidebar"
              edge="start"
              onClick={onMobileMenuToggle}
              sx={{ 
                display: { md: 'none' },
                p: 1.5,
                '&:hover': { backgroundColor: 'action.hover' }
              }}
            >
              <MenuIcon />
            </IconButton>
            
            {/* Logo */}
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                color: 'primary.main',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              VALDORA
            </Typography>
          </Box>

          {/* Search Section */}
          <Box sx={{ 
            flexGrow: 1, 
            maxWidth: { md: 520 },
            mx: { xs: 1, md: 3 }
          }}>
            {!isMobile ? (
              <Paper
                component="button"
                onClick={() => setSearchOpen(true)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  height: 40,
                  px: 2,
                  py: 1,
                  backgroundColor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                    borderColor: 'primary.main'
                  },
                  '&:focus': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: 2
                  }
                }}
              >
                <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    flexGrow: 1, 
                    textAlign: 'left',
                    color: 'text.secondary'
                  }}
                >
                  Search
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  color: 'text.disabled',
                  fontSize: '0.75rem'
                }}>
                  <Typography variant="caption">CTRL</Typography>
                  <Typography variant="caption">+</Typography>
                  <Typography variant="caption">K</Typography>
                </Box>
              </Paper>
            ) : (
              <IconButton
                onClick={() => setSearchOpen(true)}
                sx={{ p: 1 }}
                aria-label="Open search"
              >
                <SearchIcon />
              </IconButton>
            )}
          </Box>

          {/* Actions Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 0.5, md: 1 }
          }}>
            {/* Desktop Actions */}
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' }, 
              alignItems: 'center', 
              gap: 1 
            }}>
              <LanguageSelector />
              <ThemeToggle />
              <NotificationsMenu />
              <UserMenu />
            </Box>

            {/* Tablet Actions */}
            <Box sx={{ 
              display: { xs: 'none', sm: 'flex', md: 'none' }, 
              alignItems: 'center', 
              gap: 1 
            }}>
              <NotificationsMenu />
              <UserMenu />
              <IconButton
                onClick={handleMobileMenuOpen}
                aria-label="More options"
              >
                <MoreIcon />
              </IconButton>
            </Box>

            {/* Mobile Actions */}
            <Box sx={{ 
              display: { xs: 'flex', sm: 'none' }, 
              alignItems: 'center', 
              gap: 0.5 
            }}>
              <NotificationsMenu />
              <UserMenu />
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Search Palette Dialog */}
      <SearchPalette 
        open={searchOpen} 
        onClose={() => setSearchOpen(false)} 
      />

      {/* Mobile Overflow Menu */}
      {MobileMenu}
    </>
  )
}

export default TopNav
