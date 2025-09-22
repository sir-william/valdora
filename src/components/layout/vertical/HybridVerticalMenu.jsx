'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { styled } from '@mui/material/styles'
import Chip from '@mui/material/Chip'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Collapse from '@mui/material/Collapse'
import Icon from '@/@core/components/icon'
import Link from '@/components/Link'
import { useFeatureFlags } from '@/config/navigation/featureFlags'

// Import des données de navigation statiques et dynamiques
import verticalMenuData from '@/data/navigation/verticalMenuData'

const MenuItemWrapper = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  borderRadius: 8,
  color: theme.palette.text.primary,
  padding: theme.spacing(2.25, 3.5),
  transition: 'opacity .25s ease-in-out',
  '&.Mui-selected, &.Mui-selected:hover': {
    boxShadow: theme.shadows[3],
    backgroundImage: `linear-gradient(98deg, ${theme.palette.customColors.primaryGradient}, ${theme.palette.primary.main} 94%)`
  },
  '&.Mui-selected .MuiTypography-root, &.Mui-selected .MuiSvgIcon-root': {
    color: 'var(--mui-palette-common-white)'
  },
  '&:not(.Mui-selected):hover': {
    backgroundColor: 'var(--mui-palette-action-hover)'
  }
}))

const MenuSectionWrapper = styled(Typography)(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.disabled,
  letterSpacing: '0.4px',
  fontSize: '0.75rem',
  lineHeight: 1.467,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(7)
}))

const HybridVerticalMenu = ({ scrollMenu }) => {
  const pathname = usePathname()
  const [openItems, setOpenItems] = useState({})
  const [navigationData, setNavigationData] = useState([])
  const { flags, isEnabled } = useFeatureFlags()

  // Fonction pour détecter les composants avec navigationConfig
  const detectDynamicComponents = async () => {
    try {
      // Simuler la détection des composants (en production, ceci serait pré-généré)
      const dynamicComponents = [
        {
          enabled: isEnabled('TENANTS'),
          section: 'Administration',
          label: 'Tenants',
          icon: 'tabler-building',
          href: '/admin/tenants',
          order: 100,
          permissions: ['admin'],
          children: [
            { label: 'Liste des tenants', href: '/admin/tenants' },
            { label: 'Nouveau tenant', href: '/admin/tenants/new' }
          ]
        }
      ]

      return dynamicComponents.filter(comp => comp.enabled)
    } catch (error) {
      console.warn('Error detecting dynamic components:', error)
      return []
    }
  }

  // Fonction pour merger les données statiques et dynamiques
  const mergeNavigationData = (staticData, dynamicData) => {
    const merged = [...staticData]
    
    // Grouper les composants dynamiques par section
    const dynamicBySection = {}
    dynamicData.forEach(item => {
      if (!dynamicBySection[item.section]) {
        dynamicBySection[item.section] = []
      }
      dynamicBySection[item.section].push(item)
    })

    // Insérer les composants dynamiques dans les bonnes sections
    Object.keys(dynamicBySection).forEach(sectionName => {
      const sectionIndex = merged.findIndex(item => item.sectionTitle === sectionName)
      
      if (sectionIndex !== -1) {
        // Section existe, insérer après
        const itemsToInsert = dynamicBySection[sectionName].sort((a, b) => a.order - b.order)
        merged.splice(sectionIndex + 1, 0, ...itemsToInsert)
      } else {
        // Créer nouvelle section
        merged.push(
          { sectionTitle: sectionName },
          ...dynamicBySection[sectionName].sort((a, b) => a.order - b.order)
        )
      }
    })

    return merged
  }

  // Charger les données de navigation au montage
  useEffect(() => {
    const loadNavigationData = async () => {
      const staticData = verticalMenuData()
      const dynamicData = await detectDynamicComponents()
      const mergedData = mergeNavigationData(staticData, dynamicData)
      setNavigationData(mergedData)
    }

    loadNavigationData()
  }, [flags]) // Recharger quand les feature flags changent

  const handleClick = (id) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const renderMenuItem = (item, index) => {
    const itemId = `${item.label || item.sectionTitle}-${index}`
    
    // Rendu des titres de section
    if (item.sectionTitle) {
      return (
        <MenuSectionWrapper key={itemId}>
          {item.sectionTitle}
        </MenuSectionWrapper>
      )
    }

    const isSelected = pathname === item.href
    const hasChildren = item.children && item.children.length > 0
    const isOpen = openItems[itemId]

    return (
      <div key={itemId}>
        <ListItem disablePadding sx={{ mt: 1.5, px: '0 !important' }}>
          <MenuItemWrapper
            selected={isSelected}
            onClick={() => hasChildren ? handleClick(itemId) : null}
            component={hasChildren ? 'div' : Link}
            href={hasChildren ? undefined : item.href}
          >
            <ListItemIcon sx={{ mr: 2, '& svg': { fontSize: '1.375rem' } }}>
              <Icon icon={item.icon || 'tabler-circle'} />
            </ListItemIcon>
            <ListItemText 
              primary={item.label}
              primaryTypographyProps={{
                noWrap: true,
                sx: { fontWeight: isSelected ? 600 : 400 }
              }}
            />
            {item.badgeContent && (
              <Chip
                label={item.badgeContent}
                color={item.badgeColor || 'primary'}
                size='small'
                sx={{ ml: 1.5, height: 20 }}
              />
            )}
            {hasChildren && (
              <Icon 
                icon={isOpen ? 'tabler-chevron-up' : 'tabler-chevron-down'} 
                fontSize='1rem'
              />
            )}
          </MenuItemWrapper>
        </ListItem>

        {/* Sous-menu */}
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              {item.children.map((child, childIndex) => (
                <ListItem key={`${itemId}-child-${childIndex}`} disablePadding sx={{ mt: 1 }}>
                  <MenuItemWrapper
                    selected={pathname === child.href}
                    component={Link}
                    href={child.href}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemIcon sx={{ mr: 2, minWidth: 20 }}>
                      <Icon icon="tabler-circle" fontSize="0.5rem" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={child.label}
                      primaryTypographyProps={{
                        noWrap: true,
                        fontSize: '0.875rem'
                      }}
                    />
                  </MenuItemWrapper>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </div>
    )
  }

  return (
    <List component='nav' sx={{ py: 0 }}>
      {navigationData.map((item, index) => renderMenuItem(item, index))}
    </List>
  )
}

export default HybridVerticalMenu
