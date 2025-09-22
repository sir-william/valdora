'use client'

import { useState } from 'react'
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
  Collapse
} from '@mui/material'
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  AutoAwesome as MagicIcon,
  ShoppingCart as ShopIcon,
  ExpandLess,
  ExpandMore,
  AdminPanelSettings as AdminIcon
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'

const DRAWER_WIDTH = 280

// Simulation des composants détectés automatiquement
const autoDetectedNavigation = [
  {
    section: 'Principal',
    items: [
      { label: 'Accueil', href: '/', icon: <HomeIcon />, enabled: true },
      { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon />, enabled: true }
    ]
  },
  {
    section: 'Administration',
    items: [
      { 
        label: 'Tenants', 
        href: '/admin/tenants', 
        icon: <BusinessIcon />, 
        enabled: true,
        badge: 'Auto-détecté',
        children: [
          { label: 'Liste des tenants', href: '/admin/tenants' },
          { label: 'Nouveau tenant', href: '/admin/tenants/new' }
        ]
      },
      { 
        label: 'Gestion Utilisateurs', 
        href: '/admin/user-management', 
        icon: <AdminIcon />, 
        enabled: true,
        badge: 'Auto-détecté',
        children: [
          { label: 'Utilisateurs', href: '/admin/user-management/users' },
          { label: 'Rôles', href: '/admin/user-management/roles' },
          { label: 'Permissions', href: '/admin/user-management/permissions' }
        ]
      }
    ]
  },
  {
    section: 'E-commerce',
    items: [
      { label: 'Produits', href: '/products', icon: <ShopIcon />, enabled: true, badge: 'Auto-détecté' }
    ]
  },
  {
    section: 'Démonstration',
    items: [
      { 
        label: 'Navigation Auto-Détection', 
        href: '/demo-navigation', 
        icon: <MagicIcon />, 
        enabled: true,
        badge: 'Nouveau',
        color: 'primary'
      }
    ]
  }
]

const SimpleSidebar = ({ open = true, onClose, mobileOpen = false, onMobileClose }) => {
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState({})

  const handleNavigation = (href) => {
    router.push(href)
    if (onClose) onClose()
    if (onMobileClose) onMobileClose()
  }

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }))
  }

  const renderNavigationItem = (item, isChild = false) => (
    <ListItem key={item.href} disablePadding sx={{ pl: isChild ? 4 : 0 }}>
      <ListItemButton
        onClick={() => {
          if (item.children && !isChild) {
            toggleSection(item.label)
          } else {
            handleNavigation(item.href)
          }
        }}
        sx={{
          borderRadius: 1,
          mx: 1,
          mb: 0.5,
          '&:hover': {
            backgroundColor: 'primary.light',
            color: 'primary.contrastText'
          }
        }}
      >
        {!isChild && (
          <ListItemIcon sx={{ minWidth: 40 }}>
            {item.icon}
          </ListItemIcon>
        )}
        <ListItemText 
          primary={item.label}
          sx={{ ml: isChild ? 2 : 0 }}
        />
        {item.badge && (
          <Chip
            label={item.badge}
            size="small"
            color={item.color || 'success'}
            variant="outlined"
            sx={{ ml: 1, fontSize: '0.7rem', height: 20 }}
          />
        )}
        {item.children && (
          expandedSections[item.label] ? <ExpandLess /> : <ExpandMore />
        )}
      </ListItemButton>
    </ListItem>
  )

  const renderSection = (section) => (
    <Box key={section.section} sx={{ mb: 2 }}>
      <Typography
        variant="overline"
        sx={{
          px: 2,
          py: 1,
          display: 'block',
          fontWeight: 'bold',
          color: 'text.secondary',
          fontSize: '0.75rem'
        }}
      >
        {section.section}
      </Typography>
      
      <List dense>
        {section.items.map(item => (
          <Box key={item.href}>
            {renderNavigationItem(item)}
            {item.children && (
              <Collapse in={expandedSections[item.label]} timeout="auto" unmountOnExit>
                <List component="div" dense>
                  {item.children.map(child => renderNavigationItem(child, true))}
                </List>
              </Collapse>
            )}
          </Box>
        ))}
      </List>
      
      <Divider sx={{ mx: 2, my: 1 }} />
    </Box>
  )

  const drawerContent = (
    <>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          VALDORA
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Navigation Auto-Détection
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ overflow: 'auto', py: 2 }}>
        {autoDetectedNavigation.map(renderSection)}
        
        {/* Info Box */}
        <Box sx={{ mx: 2, p: 2, bgcolor: 'primary.light', borderRadius: 2, color: 'primary.contrastText' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
            🎯 Auto-Détection Active
          </Typography>
          <Typography variant="caption">
            Les composants avec <code>navigationConfig</code> apparaissent automatiquement dans ce menu.
          </Typography>
        </Box>
      </Box>
    </>
  )

  return (
    <Box component="nav" sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
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
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  )
}

export default SimpleSidebar
