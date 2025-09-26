'use client'

import { useEffect, useState } from 'react'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Box,
  Divider,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  ExpandLess,
  ExpandMore,
  Dashboard as DashboardIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon,
  Home as HomeIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material'
import { useRouter, usePathname } from 'next/navigation'
import { useNavigationConfig, useNavigationPermissions } from '@/hooks/useNavigationConfig'

// Mapping des icônes pour les éléments de navigation
const iconMap = {
  'tabler-smart-home': HomeIcon,
  'tabler-dashboard': DashboardIcon,
  'tabler-building': BusinessIcon,
  'tabler-settings': SettingsIcon,
  'tabler-chart-line': AnalyticsIcon,
  'tabler-package': BusinessIcon,
  'tabler-flask': SettingsIcon,
  'tabler-info-circle': SettingsIcon,
  'tabler-magic': AnalyticsIcon,
  'tabler-file-text': BusinessIcon,
  'tabler-device-mobile': SettingsIcon,
  'tabler-users-group': BusinessIcon
}

const DynamicNavigation = ({ userPermissions = ['admin'] }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState(new Set(['Administration']))
  
  const { navigation, loading, error, refresh } = useNavigationConfig()
  const { filterNavigationByPermissions } = useNavigationPermissions(userPermissions)

  // Filtrer la navigation selon les permissions
  const filteredNavigation = filterNavigationByPermissions(navigation)

  const handleSectionToggle = (sectionTitle) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle)
    } else {
      newExpanded.add(sectionTitle)
    }
    setExpandedSections(newExpanded)
  }

  const handleItemClick = (href) => {
    router.push(href)
  }

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || BusinessIcon
    return <IconComponent />
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert 
        severity="warning" 
        sx={{ m: 1 }}
        action={
          <Chip 
            label="Actualiser" 
            size="small" 
            onClick={refresh}
            clickable
          />
        }
      >
        Navigation dynamique indisponible
      </Alert>
    )
  }

  return (
    <List component="nav" sx={{ width: '100%' }}>
      {filteredNavigation.map((section, sectionIndex) => (
        <Box key={section.sectionTitle || sectionIndex}>
          {/* Titre de section */}
          {section.sectionTitle && (
            <>
              <ListItem>
                <ListItemButton
                  onClick={() => handleSectionToggle(section.sectionTitle)}
                  sx={{ 
                    borderRadius: 1,
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {section.sectionTitle}
                      </Typography>
                    }
                  />
                  {expandedSections.has(section.sectionTitle) ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              
              <Collapse in={expandedSections.has(section.sectionTitle)} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {section.items?.map((item, itemIndex) => (
                    <NavigationItem
                      key={item.href || itemIndex}
                      item={item}
                      isActive={isActive(item.href)}
                      onItemClick={handleItemClick}
                      getIcon={getIcon}
                      level={1}
                    />
                  ))}
                </List>
              </Collapse>
            </>
          )}
          
          {/* Items sans section */}
          {!section.sectionTitle && section.items?.map((item, itemIndex) => (
            <NavigationItem
              key={item.href || itemIndex}
              item={item}
              isActive={isActive(item.href)}
              onItemClick={handleItemClick}
              getIcon={getIcon}
              level={0}
            />
          ))}
          
          {sectionIndex < filteredNavigation.length - 1 && <Divider sx={{ my: 1 }} />}
        </Box>
      ))}
    </List>
  )
}

// Composant pour un élément de navigation individuel
const NavigationItem = ({ item, isActive, onItemClick, getIcon, level = 0 }) => {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0

  const handleClick = () => {
    if (hasChildren) {
      setExpanded(!expanded)
    } else {
      onItemClick(item.href)
    }
  }

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleClick}
          selected={isActive}
          sx={{
            pl: 2 + level * 2,
            borderRadius: 1,
            mx: 1,
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '& .MuiListItemIcon-root': {
                color: 'primary.contrastText',
              }
            }
          }}
        >
          {item.icon && (
            <ListItemIcon sx={{ minWidth: 40 }}>
              {getIcon(item.icon)}
            </ListItemIcon>
          )}
          <ListItemText 
            primary={item.label}
            primaryTypographyProps={{
              variant: 'body2',
              fontWeight: isActive ? 600 : 400
            }}
          />
          {hasChildren && (expanded ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>
      
      {hasChildren && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {item.children.map((child, childIndex) => (
              <NavigationItem
                key={child.href || childIndex}
                item={child}
                isActive={isActive}
                onItemClick={onItemClick}
                getIcon={getIcon}
                level={level + 1}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  )
}

export default DynamicNavigation
