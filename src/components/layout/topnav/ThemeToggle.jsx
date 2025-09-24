'use client'

import { useState, useEffect } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography
} from '@mui/material'
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  SettingsBrightness as SystemModeIcon
} from '@mui/icons-material'

const THEME_OPTIONS = [
  { 
    value: 'system', 
    label: 'System', 
    icon: <SystemModeIcon />,
    description: 'Use system preference'
  },
  { 
    value: 'light', 
    label: 'Light', 
    icon: <LightModeIcon />,
    description: 'Light theme'
  },
  { 
    value: 'dark', 
    label: 'Dark', 
    icon: <DarkModeIcon />,
    description: 'Dark theme'
  }
]

const ThemeToggle = () => {
  const [currentTheme, setCurrentTheme] = useState('system')
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'system'
    setCurrentTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  // Apply theme to document
  const applyTheme = (theme) => {
    const root = document.documentElement
    
    if (theme === 'system') {
      // Use system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', systemPrefersDark)
    } else {
      root.classList.toggle('dark', theme === 'dark')
    }
  }

  // Handle theme change
  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
    setAnchorEl(null)

    // Telemetry
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'nav.theme.changed', {
        theme: newTheme
      })
    }
  }

  // Cycle through themes on click (for quick toggle)
  const handleQuickToggle = () => {
    const currentIndex = THEME_OPTIONS.findIndex(option => option.value === currentTheme)
    const nextIndex = (currentIndex + 1) % THEME_OPTIONS.length
    const nextTheme = THEME_OPTIONS[nextIndex].value
    handleThemeChange(nextTheme)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  // Get current theme icon
  const getCurrentIcon = () => {
    const option = THEME_OPTIONS.find(opt => opt.value === currentTheme)
    return option ? option.icon : <SystemModeIcon />
  }

  return (
    <>
      <Tooltip title={`Theme: ${currentTheme}`} arrow>
        <IconButton
          onClick={handleMenuOpen}
          onContextMenu={(e) => {
            e.preventDefault()
            handleQuickToggle()
          }}
          size="medium"
          aria-label="Toggle theme"
          aria-haspopup="menu"
          aria-expanded={open}
          sx={{
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'action.hover',
              transform: 'scale(1.05)'
            },
            transition: 'all 0.2s ease-in-out'
          }}
        >
          {getCurrentIcon()}
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
            minWidth: 180,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid',
            borderColor: 'divider'
          }
        }}
      >
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: 'block',
            color: 'text.secondary',
            fontWeight: 'medium'
          }}
        >
          Theme Preference
        </Typography>
        
        {THEME_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleThemeChange(option.value)}
            selected={currentTheme === option.value}
            sx={{
              py: 1.5,
              px: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.main'
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              {option.icon}
            </ListItemIcon>
            <ListItemText 
              primary={option.label}
              secondary={option.description}
              primaryTypographyProps={{
                fontWeight: currentTheme === option.value ? 'bold' : 'normal'
              }}
            />
          </MenuItem>
        ))}
        
        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: 'block',
            color: 'text.disabled',
            fontSize: '0.7rem'
          }}
        >
          Right-click icon for quick toggle
        </Typography>
      </Menu>
    </>
  )
}

export default ThemeToggle
