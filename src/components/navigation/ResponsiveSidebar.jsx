'use client'

import { useState, useEffect } from 'react'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Chip,
  Collapse,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom
} from '@mui/material'
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  AutoAwesome as MagicIcon,
  ShoppingCart as ShopIcon,
  ExpandLess,
  ExpandMore,
  AdminPanelSettings as AdminIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'
import { useNavigationConfig } from '@/hooks/useNavigationConfig'

const DRAWER_WIDTH = 280
const DRAWER_WIDTH_COLLAPSED = 64

// Mapping des icônes
const iconMap = {
  'tabler-smart-home': <HomeIcon />,
  'tabler-dashboard': <DashboardIcon />,
  'tabler-package': <ShopIcon />,
  'tabler-building': <BusinessIcon />,
  'tabler-users-group': <AdminIcon />,
  'tabler-chart-line': <DashboardIcon />,
  'tabler-magic': <MagicIcon />
}

const ResponsiveSidebar = ({ 
  open = true, 
  onClose, 
  mobileOpen = false, 
  onMobileClose,
  collapsed = false,
  onToggleCollapse 
}) => {
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [expandedSections, setExpandedSections] = useState({})
  const { navigation, loading, error } = useNavigationConfig()

  // Auto-collapse sur mobile
  useEffect(() => {
    if (isMobile && onToggleCollapse) {
      onToggleCollapse(true)
    }
  }, [isMobile, onToggleCollapse])

  const handleNavigation = (href) => {
    router.push(href)
    if (onClose) onClose()
    if (onMobileClose) onMobileClose()
  }

  const toggleSection = (sectionName) => {
    if (collapsed && !isMobile) return // Pas d'expansion en mode collapsed desktop
    
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }))
  }

  const getIcon = (iconName) => {
    return iconMap[iconName] || <HomeIcon />
  }

  const renderNavigationItem = (item, isChild = false) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedSections[item.label]

    return (
      <Box key={item.href || item.id}>
        <ListItem disablePadding sx={{ pl: isChild ? (collapsed ? 0 : 4) : 0 }}>
          <Tooltip 
            title={collapsed && !isMobile ? item.label : ''} 
            placement="right"
            arrow
          >
            <ListItemButton
              onClick={() => {
                if (hasChildren && !isChild) {
                  toggleSection(item.label)
                } else {
                  handleNavigation(item.href)
                }
              }}
              sx={{
                borderRadius: 1,
                mx: collapsed && !isMobile ? 0.5 : 1,
                mb: 0.5,
                minHeight: 48,
                justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                px: collapsed && !isMobile ? 1 : 2,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  transform: 'translateX(4px)',
                  transition: 'all 0.2s ease-in-out'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {!isChild && (
                <ListItemIcon 
                  sx={{ 
                    minWidth: collapsed && !isMobile ? 0 : 40,
                    justifyContent: 'center',
                    color: 'inherit'
                  }}
                >
                  {getIcon(item.icon)}
                </ListItemIcon>
              )}
              
              {(!collapsed || isMobile) && (
                <>
                  <ListItemText 
                    primary={item.label}
                    sx={{ 
                      ml: isChild ? 2 : 0,
                      opacity: collapsed && !isMobile ? 0 : 1,
                      transition: 'opacity 0.2s ease-in-out'
                    }}
                  />
                  
                  {item.badge && (
                    <Zoom in={!collapsed || isMobile}>
                      <Chip
                        label={item.badge.label}
                        size="small"
                        color={item.badge.color || 'success'}
                        variant="outlined"
                        sx={{ 
                          ml: 1, 
                          fontSize: '0.7rem', 
                          height: 20,
                          opacity: collapsed && !isMobile ? 0 : 1,
                          transition: 'opacity 0.2s ease-in-out'
                        }}
                      />
                    </Zoom>
                  )}
                  
                  {hasChildren && (
                    <Box sx={{ 
                      opacity: collapsed && !isMobile ? 0 : 1,
                      transition: 'opacity 0.2s ease-in-out'
                    }}>
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  )}
                </>
              )}
            </ListItemButton>
          </Tooltip>
        </ListItem>
        
        {hasChildren && (!collapsed || isMobile) && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" dense>
              {item.children.map(child => renderNavigationItem(child, true))}
            </List>
          </Collapse>
        )}
      </Box>
    )
  }

  const renderSection = (sectionName, items) => (
    <Box key={sectionName} sx={{ mb: 2 }}>
      {(!collapsed || isMobile) && (
        <Fade in={!collapsed || isMobile}>
          <Typography
            variant="overline"
            sx={{
              px: 2,
              py: 1,
              display: 'block',
              fontWeight: 'bold',
              color: 'text.secondary',
              fontSize: '0.75rem',
              opacity: collapsed && !isMobile ? 0 : 1,
              transition: 'opacity 0.2s ease-in-out'
            }}
          >
            {sectionName}
          </Typography>
        </Fade>
      )}
      
      <List dense>
        {items.map(item => renderNavigationItem(item))}
      </List>
      
      {(!collapsed || isMobile) && <Divider sx={{ mx: 2, my: 1 }} />}
    </Box>
  )

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header avec toggle */}
      <Box sx={{ 
        p: 2, 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ 
          opacity: collapsed && !isMobile ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            VALDORA
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Navigation Dynamique
          </Typography>
        </Box>
        
        {!isMobile && onToggleCollapse && (
          <Tooltip title={collapsed ? 'Élargir' : 'Rétrécir'} arrow>
            <IconButton 
              onClick={() => onToggleCollapse(!collapsed)}
              size="small"
              sx={{
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ 
        overflow: 'auto', 
        py: 2, 
        flexGrow: 1,
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'rgba(0,0,0,0.2)',
          borderRadius: '3px',
        },
      }}>
        {loading && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Chargement de la navigation...
            </Typography>
          </Box>
        )}
        
        {error && (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="error">
              Erreur: {error}
            </Typography>
          </Box>
        )}
        
        {!loading && !error && navigation && Object.keys(navigation).map(sectionName => 
          renderSection(sectionName, navigation[sectionName])
        )}
      </Box>

      {/* Info Box */}
      {(!collapsed || isMobile) && (
        <Fade in={!collapsed || isMobile}>
          <Box sx={{ 
            mx: 2, 
            mb: 2, 
            p: 2, 
            bgcolor: 'primary.light', 
            borderRadius: 2, 
            color: 'primary.contrastText',
            opacity: collapsed && !isMobile ? 0 : 1,
            transition: 'opacity 0.2s ease-in-out'
          }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              🎯 Navigation Dynamique
            </Typography>
            <Typography variant="caption">
              Les composants avec <code>navigationConfig</code> apparaissent automatiquement.
            </Typography>
          </Box>
        </Fade>
      )}
    </Box>
  )

  const drawerWidth = collapsed && !isMobile ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH

  return (
    <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider'
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: 'width 0.3s ease-in-out',
            overflowX: 'hidden'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  )
}

export default ResponsiveSidebar
