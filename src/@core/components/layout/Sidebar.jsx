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
import { isFeatureEnabled } from '../../utils/featureFlags'

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
    id: 'ai-generation',
    label: 'Génération IA',
    icon: AutoAwesome,
    path: '/ai-generation',
    badge: null,
    featureFlag: 'AI_GENERATION',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: Analytics,
    path: '/analytics',
    badge: null,
    featureFlag: 'ANALYTICS',
  },
  {
    id: 'stores',
    label: 'Boutiques IA',
    icon: Store,
    path: '/stores',
    badge: null,
    featureFlag: 'AI_DRAFTS',
    children: [
      {
        id: 'ai-drafts',
        label: 'Brouillons IA',
        icon: AutoAwesome,
        path: '/ai-drafts',
        badge: 3,
        featureFlag: 'AI_DRAFTS',
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
    badge: 5,
    featureFlag: 'ORDERS',
  },
  {
    id: 'products',
    label: 'Produits',
    icon: Inventory,
    path: '/products',
    badge: null,
    featureFlag: 'PRODUCTS',
  },
  {
    id: 'tenants',
    label: 'Tenants',
    icon: Store,
    path: '/tenants',
    badge: null,
    featureFlag: 'TENANTS',
  },
  {
    id: 'users',
    label: 'Gestion Utilisateurs',
    icon: Person,
    path: '/users',
    badge: null,
    featureFlag: 'USER_MANAGEMENT',
  },
  {
    id: 'api-test',
    label: 'Test API',
    icon: Settings,
    path: '/api-test',
    badge: null,
    featureFlag: 'API_TEST',
  },
  {
    id: 'admin',
    label: 'Administration',
    icon: Settings,
    path: '/admin',
    badge: null,
    children: [
      {
        id: 'feature-flags',
        label: 'Feature Flags',
        icon: Settings,
        path: '/admin/feature-flags',
        badge: null,
      },
    ],
  },
]

const Sidebar = ({ open, onToggle }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState({})

  // Filtrer les éléments de menu selon les feature flags
  const filterMenuItems = (items) => {
    return items.filter(item => {
      // Si l'item a un feature flag, vérifier s'il est activé
      if (item.featureFlag && !isFeatureEnabled(item.featureFlag)) {
        return false
      }
      
      // Filtrer récursivement les enfants
      if (item.children) {
        item.children = filterMenuItems(item.children)
        // Si tous les enfants sont filtrés et que l'item parent n'a pas de path propre, le cacher
        if (item.children.length === 0 && !item.path) {
          return false
        }
      }
      
      return true
    })
  }

  const filteredMenuItems = filterMenuItems([...menuItems])

  const handleItemClick = (item) => {
    if (item.children) {
      setExpandedItems(prev => ({
        ...prev,
        [item.id]: !prev[item.id]
      }))
    } else if (item.path) {
      router.push(item.path)
    }
  }

  const isActive = (path) => {
    return pathname === path
  }

  const isParentActive = (item) => {
    if (item.children) {
      return item.children.some(child => isActive(child.path))
    }
    return false
  }

  const renderMenuItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems[item.id]
    const active = isActive(item.path)
    const parentActive = isParentActive(item)

    return (
      <motion.div
        key={item.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleItemClick(item)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
              pl: level > 0 ? 4 : 2.5,
              backgroundColor: active || parentActive ? 'primary.main' : 'transparent',
              color: active || parentActive ? 'primary.contrastText' : 'text.primary',
              '&:hover': {
                backgroundColor: active || parentActive ? 'primary.dark' : 'action.hover',
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
                color: active || parentActive ? 'primary.contrastText' : 'text.primary',
              }}
            >
              <Badge
                badgeContent={item.badge}
                color="error"
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
                  fontWeight: active || parentActive ? 600 : 400,
                },
              }}
            />
            {hasChildren && open && (
              <IconButton
                size="small"
                sx={{
                  color: active || parentActive ? 'primary.contrastText' : 'text.primary',
                }}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </ListItemButton>
        </ListItem>

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
          transition: 'width 0.3s ease-in-out',
          overflowX: 'hidden',
          backgroundColor: 'background.paper',
          borderRight: '1px solid',
          borderColor: 'divider',
        },
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
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
              VALDORA
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Navigation Dynamique
            </Typography>
          </motion.div>
        )}
        <IconButton onClick={onToggle} size="small">
          {open ? <ChevronLeft /> : <ChevronRight />}
        </IconButton>
      </Box>

      <Divider />

      {/* Menu Principal */}
      {open && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            PRINCIPAL
          </Typography>
        </Box>
      )}

      <List sx={{ px: 1 }}>
        {filteredMenuItems.slice(0, 3).map(item => renderMenuItem(item))}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* E-commerce */}
      {open && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            E-COMMERCE
          </Typography>
        </Box>
      )}

      <List sx={{ px: 1 }}>
        {filteredMenuItems.slice(3, 6).map(item => renderMenuItem(item))}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Administration */}
      {open && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            ADMINISTRATION
          </Typography>
        </Box>
      )}

      <List sx={{ px: 1 }}>
        {filteredMenuItems.slice(6).map(item => renderMenuItem(item))}
      </List>

      {/* Footer */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Box
              sx={{
                p: 2,
                backgroundColor: 'primary.main',
                borderRadius: 2,
                color: 'primary.contrastText',
                textAlign: 'center',
              }}
            >
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
                🎯 Navigation Dynamique
              </Typography>
              <Typography variant="caption" display="block" sx={{ fontSize: '0.7rem', opacity: 0.8 }}>
                Les composants avec `navigationConfig` apparaissent automatiquement.
              </Typography>
            </Box>
          </motion.div>
        )}
      </Box>
    </Drawer>
  )
}

export default Sidebar
