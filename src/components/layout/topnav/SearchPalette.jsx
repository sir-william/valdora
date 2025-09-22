'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material'
import {
  Search as SearchIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  ShoppingCart as ShopIcon,
  Add as AddIcon,
  History as HistoryIcon
} from '@mui/icons-material'

// Mock search results (will be replaced with API calls)
const MOCK_SEARCH_RESULTS = [
  // Pages
  {
    id: 1,
    type: 'page',
    title: 'Dashboard',
    description: 'Main dashboard with analytics overview',
    url: '/dashboard',
    icon: <DashboardIcon />,
    category: 'Navigation'
  },
  {
    id: 2,
    type: 'page',
    title: 'User Management',
    description: 'Manage users, roles, and permissions',
    url: '/admin/user-management',
    icon: <PeopleIcon />,
    category: 'Administration'
  },
  {
    id: 3,
    type: 'page',
    title: 'Tenants',
    description: 'Manage tenant accounts and settings',
    url: '/admin/tenants',
    icon: <BusinessIcon />,
    category: 'Administration'
  },
  {
    id: 4,
    type: 'page',
    title: 'Products',
    description: 'Browse and manage products',
    url: '/products',
    icon: <ShopIcon />,
    category: 'E-commerce'
  },
  
  // Actions
  {
    id: 5,
    type: 'action',
    title: 'Create New Tenant',
    description: 'Add a new tenant to the platform',
    action: () => window.location.href = '/admin/tenants/new',
    icon: <AddIcon />,
    category: 'Actions'
  },
  {
    id: 6,
    type: 'action',
    title: 'Open Settings',
    description: 'Access application settings',
    action: () => window.location.href = '/settings',
    icon: <SettingsIcon />,
    category: 'Actions'
  }
]

// Recent searches (stored in localStorage)
const getRecentSearches = () => {
  try {
    return JSON.parse(localStorage.getItem('recentSearches') || '[]')
  } catch {
    return []
  }
}

const saveRecentSearch = (search) => {
  try {
    const recent = getRecentSearches()
    const filtered = recent.filter(item => item.title !== search.title)
    const updated = [search, ...filtered].slice(0, 5) // Keep only 5 recent
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save recent search:', error)
  }
}

const SearchPalette = ({ open, onClose }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState([])
  const inputRef = useRef(null)

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  // Focus input when dialog opens
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100)
    }
  }, [open])

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [open])

  // Search function with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        // Filter results based on query
        const filtered = MOCK_SEARCH_RESULTS.filter(item =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered)
        setSelectedIndex(0)
      } else {
        setResults([])
      }
    }, 200) // 200ms debounce

    return () => clearTimeout(timeoutId)
  }, [query])

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    const currentResults = query.trim() ? results : recentSearches
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setSelectedIndex(prev => 
          prev < currentResults.length - 1 ? prev + 1 : 0
        )
        break
        
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : currentResults.length - 1
        )
        break
        
      case 'Enter':
        event.preventDefault()
        if (currentResults[selectedIndex]) {
          handleItemSelect(currentResults[selectedIndex])
        }
        break
        
      case 'Escape':
        event.preventDefault()
        onClose()
        break
    }
  }

  // Handle item selection
  const handleItemSelect = (item) => {
    // Save to recent searches
    saveRecentSearch(item)
    
    // Telemetry
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'nav.search.result_clicked', {
        query: query,
        result_type: item.type,
        result_title: item.title
      })
    }

    // Execute action or navigate
    if (item.action) {
      item.action()
    } else if (item.url) {
      window.location.href = item.url
    }

    onClose()
  }

  // Group results by category
  const groupedResults = results.reduce((groups, item) => {
    const category = item.category || 'Other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(item)
    return groups
  }, {})

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 16px 64px rgba(0,0,0,0.24)',
          border: '1px solid',
          borderColor: 'divider',
          overflow: 'hidden'
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Search Input */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            px: 3,
            py: 2,
            borderBottom: '1px solid',
            borderColor: 'divider'
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 2 }} />
          <InputBase
            ref={inputRef}
            placeholder="Search pages, actions, or type a command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              flex: 1,
              fontSize: '1.1rem',
              '& input': {
                padding: 0
              }
            }}
            autoComplete="off"
          />
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            color: 'text.disabled',
            fontSize: '0.75rem',
            ml: 2
          }}>
            <Typography variant="caption">ESC</Typography>
          </Box>
        </Box>

        {/* Results */}
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {query.trim() ? (
            // Search Results
            results.length > 0 ? (
              Object.entries(groupedResults).map(([category, categoryResults]) => (
                <Box key={category}>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 3,
                      py: 1,
                      display: 'block',
                      color: 'text.secondary',
                      fontWeight: 'medium',
                      backgroundColor: 'background.default'
                    }}
                  >
                    {category}
                  </Typography>
                  
                  <List dense>
                    {categoryResults.map((item, index) => {
                      const globalIndex = results.indexOf(item)
                      return (
                        <ListItem
                          key={item.id}
                          button
                          selected={selectedIndex === globalIndex}
                          onClick={() => handleItemSelect(item)}
                          sx={{
                            py: 1.5,
                            '&.Mui-selected': {
                              backgroundColor: 'primary.light',
                              color: 'primary.contrastText'
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.title}
                            secondary={item.description}
                            primaryTypographyProps={{
                              fontWeight: 'medium'
                            }}
                          />
                          <Chip
                            label={item.type}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </ListItem>
                      )
                    })}
                  </List>
                </Box>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No results found for "{query}"
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  Try a different search term
                </Typography>
              </Box>
            )
          ) : (
            // Recent Searches
            recentSearches.length > 0 && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    px: 3,
                    py: 1,
                    display: 'block',
                    color: 'text.secondary',
                    fontWeight: 'medium',
                    backgroundColor: 'background.default'
                  }}
                >
                  Recent Searches
                </Typography>
                
                <List dense>
                  {recentSearches.map((item, index) => (
                    <ListItem
                      key={`recent-${item.id}-${index}`}
                      button
                      selected={selectedIndex === index}
                      onClick={() => handleItemSelect(item)}
                      sx={{
                        py: 1.5,
                        '&.Mui-selected': {
                          backgroundColor: 'primary.light',
                          color: 'primary.contrastText'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <HistoryIcon sx={{ color: 'text.secondary' }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.title}
                        secondary={item.description}
                        primaryTypographyProps={{
                          fontWeight: 'medium'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 3,
            py: 1.5,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.default'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.75rem', color: 'text.disabled' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption">↑↓</Typography>
              <Typography variant="caption">Navigate</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption">↵</Typography>
              <Typography variant="caption">Select</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography variant="caption">ESC</Typography>
              <Typography variant="caption">Close</Typography>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default SearchPalette
