'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Collapse,
  Badge,
} from '@mui/material'
import {
  Dashboard,
  Store,
  ShoppingCart,
  Analytics,
  Settings,
  Person,
  Logout,
  ChevronLeft,
  ChevronRight,
  ExpandLess,
  ExpandMore,
  AutoAwesome,
  Inventory,
  TrendingUp,
  Notifications,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../hooks/useAuth'
import { config, isFeatureEnabled } from '../../utils/config'

const SIDEBAR_WIDTH = 280
const SIDEBAR_COLLAPSED_WIDTH = 64

const menuItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Dashboard,
    path: '/dashboard',
    badge: null,
  },
  {
    id: 'stores',
    label: 'Boutiques IA',
    icon: Store,
    path: '/stores',
    badge: null,
    children: [
      {
        id: 'ai-drafts',
        label: 'Brouillons IA',
        icon: AutoAwesome,
        path: '/stores/ai-drafts',
        badge: 3,
      },
      {
        id: 'active-stores',
        label: 'Boutiques actives',
        icon: Inventory,
        path: '/stores/active',
        badge: null,
      },
    ],
  },
  {
    id: 'orders',
    label: 'Commandes',
    icon: ShoppingCart,
    path: '/orders',
    badge: 12,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: Analytics,
    path: '/analytics',
    badge: null,
    feature: 'analytics',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Notifications,
    path: '/notifications',
    badge: 5,
    feature: 'notifications',
  },
]

const bottomMenuItems = [
  {
    id: 'settings',
    label: 'Paramètres',
    icon: Settings,
    path: '/settings',
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: Person,
    path: '/profile',
  },
]

const Sidebar = ({ open, onToggle }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [expandedItems, setExpandedItems] = useState(['stores'])

  const handleItemClick = (item) => {
    if (item.children) {
      setExpandedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id)
          : [...prev, item.id]
      )
    } else {
      router.push(item.path)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isItemActive = (path) => {
    return pathname === path || pathname.startsWith(path + '/')
  }

  const renderMenuItem = (item, level = 0) => {
    // Vérifier les feature flags
    if (item.feature && !isFeatureEnabled(item.feature)) {
      return null
    }

    const isActive = isItemActive(item.path)
    const isExpanded = expandedItems.includes(item.id)
    const hasChildren = item.children && item.children.length > 0

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2, delay: level * 0.05 }}
      >
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              pl: level > 0 ? 4 : 2.5,
              backgroundColor: isActive ? 'primary.main' : 'transparent',
              color: isActive ? 'primary.contrastText' : 'text.primary',
              '&:hover': {
                backgroundColor: isActive ? 'primary.dark' : 'action.hover',
              },
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
                color: isActive ? 'primary.contrastText' : 'text.secondary',
              }}
            >
              <Badge
                badgeContent={item.badge}
                color="error"
                variant="dot"
                invisible={!item.badge}
              >
                <item.icon />
              </Badge>
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                opacity: open ? 1 : 0,
                '& .MuiListItemText-primary': {
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                },
              }}
            />
            {hasChildren && open && (
              <Box sx={{ color: isActive ? 'primary.contrastText' : 'text.secondary' }}>
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </Box>
            )}
          </ListItemButton>
        </ListItem>

        {/* Sous-menu */}
        {hasChildren && (
          <AnimatePresence>
            {open && (
              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <List component="div" disablePadding>
                    {item.children.map(child => renderMenuItem(child, level + 1))}
                  </List>
                </motion.div>
              </Collapse>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    )
  }

  const sidebarContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          p: 2,
          minHeight: 64,
        }}
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'primary.main',
                    fontSize: '1rem',
                  }}
                >
                  V
                </Avatar>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  VALDORA
                </Typography>
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
        
        <IconButton
          onClick={onToggle}
          sx={{
            color: 'text.secondary',
            '&:hover': { backgroundColor: 'action.hover' },
          }}
        >
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      <Divider />

      {/* User Info */}
      {open && user && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: 'secondary.main',
                }}
              >
                {user.name?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.name || 'Utilisateur'}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user.email}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Divider />
        </motion.div>
      )}

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        <List>
          {menuItems.map(item => renderMenuItem(item))}
        </List>
      </Box>

      <Divider />

      {/* Bottom Menu */}
      <Box sx={{ pb: 1 }}>
        <List>
          {bottomMenuItems.map(item => renderMenuItem(item))}
          
          {/* Logout */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                '&:hover': {
                  backgroundColor: 'error.light',
                  color: 'error.contrastText',
                },
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: 'text.secondary',
                }}
              >
                <Logout />
              </ListItemIcon>
              <ListItemText
                primary="Déconnexion"
                sx={{
                  opacity: open ? 1 : 0,
                  '& .MuiListItemText-primary': {
                    fontSize: '0.875rem',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  )

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        '& .MuiDrawer-paper': {
          width: open ? SIDEBAR_WIDTH : SIDEBAR_COLLAPSED_WIDTH,
          transition: theme => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          border: 'none',
          boxShadow: '2px 0 12px rgba(0, 0, 0, 0.08)',
        },
      }}
    >
      {sidebarContent}
    </Drawer>
  )
}

export default Sidebar
