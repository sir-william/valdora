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
  InputBase,
  Box,
  Avatar
} from '@mui/material'
import {
  Language as LanguageIcon,
  Search as SearchIcon
} from '@mui/icons-material'

const LANGUAGES = [
  { 
    code: 'fr', 
    name: 'Français', 
    nativeName: 'Français',
    flag: '🇫🇷'
  },
  { 
    code: 'en', 
    name: 'English', 
    nativeName: 'English',
    flag: '🇺🇸'
  },
  { 
    code: 'es', 
    name: 'Spanish', 
    nativeName: 'Español',
    flag: '🇪🇸'
  },
  { 
    code: 'de', 
    name: 'German', 
    nativeName: 'Deutsch',
    flag: '🇩🇪'
  },
  { 
    code: 'it', 
    name: 'Italian', 
    nativeName: 'Italiano',
    flag: '🇮🇹'
  },
  { 
    code: 'pt', 
    name: 'Portuguese', 
    nativeName: 'Português',
    flag: '🇵🇹'
  },
  { 
    code: 'ar', 
    name: 'Arabic', 
    nativeName: 'العربية',
    flag: '🇸🇦'
  },
  { 
    code: 'zh', 
    name: 'Chinese', 
    nativeName: '中文',
    flag: '🇨🇳'
  },
  { 
    code: 'ja', 
    name: 'Japanese', 
    nativeName: '日本語',
    flag: '🇯🇵'
  },
  { 
    code: 'ko', 
    name: 'Korean', 
    nativeName: '한국어',
    flag: '🇰🇷'
  }
]

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState('fr')
  const [anchorEl, setAnchorEl] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const open = Boolean(anchorEl)

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('locale') || 'fr'
    setCurrentLanguage(savedLanguage)
  }, [])

  // Filter languages based on search term
  const filteredLanguages = LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle language change
  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode)
    localStorage.setItem('locale', languageCode)
    setAnchorEl(null)
    setSearchTerm('')

    // Here you would typically trigger i18n language change
    // For example: i18n.changeLanguage(languageCode)

    // Telemetry
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'nav.lang.changed', {
        language: languageCode
      })
    }

    // Optional: Reload page to apply language changes
    // window.location.reload()
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSearchTerm('')
  }

  // Get current language info
  const getCurrentLanguage = () => {
    return LANGUAGES.find(lang => lang.code === currentLanguage) || LANGUAGES[0]
  }

  const currentLang = getCurrentLanguage()

  return (
    <>
      <Tooltip title={`Language: ${currentLang.name}`} arrow>
        <IconButton
          onClick={handleMenuOpen}
          size="medium"
          aria-label="Change language"
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
          <LanguageIcon />
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
            maxHeight: 400,
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
          Select Language
        </Typography>

        {/* Search Input */}
        <Box sx={{ px: 2, pb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              px: 1.5,
              py: 0.5
            }}
          >
            <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
            <InputBase
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                flex: 1,
                fontSize: '0.875rem'
              }}
              autoFocus
            />
          </Box>
        </Box>

        {/* Language List */}
        <Box sx={{ maxHeight: 250, overflow: 'auto' }}>
          {filteredLanguages.length > 0 ? (
            filteredLanguages.map((language) => (
              <MenuItem
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                selected={currentLanguage === language.code}
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
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Typography sx={{ fontSize: '1.2rem' }}>
                    {language.flag}
                  </Typography>
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        {language.name}
                      </Typography>
                      {currentLanguage === language.code && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            px: 1,
                            py: 0.25,
                            borderRadius: 1,
                            fontSize: '0.7rem'
                          }}
                        >
                          Current
                        </Typography>
                      )}
                    </Box>
                  }
                  secondary={language.nativeName}
                  secondaryTypographyProps={{
                    fontSize: '0.75rem',
                    color: 'text.secondary'
                  }}
                />
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>
              <ListItemText 
                primary="No languages found"
                secondary="Try a different search term"
              />
            </MenuItem>
          )}
        </Box>

        <Typography
          variant="caption"
          sx={{
            px: 2,
            py: 1,
            display: 'block',
            color: 'text.disabled',
            fontSize: '0.7rem',
            borderTop: '1px solid',
            borderColor: 'divider',
            mt: 1
          }}
        >
          Current: {currentLang.nativeName} ({currentLang.code.toUpperCase()})
        </Typography>
      </Menu>
    </>
  )
}

export default LanguageSelector
