'use client'

import React, { useState } from 'react'
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Badge,
} from '@mui/material'
import {
  People as PeopleIcon,
  Security as SecurityIcon,
  VpnKey as VpnKeyIcon,
} from '@mui/icons-material'

// Import components
import UserList from './users/UserList'
import UserDetail from './users/UserDetail'
import UserForm from './users/UserForm'
import RoleList from './roles/RoleList'
import PermissionList from './permissions/PermissionList'

// Navigation configuration for auto-detection
export const navigationConfig = {
  enabled: true,
  section: 'Administration',
  label: 'Utilisateurs & Permissions',
  icon: 'tabler-users-group',
  order: 290,
  permissions: ['user.read.all', 'role.read.all', 'permission.read.all'],
  featureFlag: 'USER_ROLE_PERMISSION'
}

const UserRolePermissionManagement = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [currentView, setCurrentView] = useState('list') // list, detail, form
  const [selectedItem, setSelectedItem] = useState(null)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setCurrentView('list')
    setSelectedItem(null)
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setSelectedItem(null)
  }

  const handleItemSelect = (item) => {
    setSelectedItem(item)
    setCurrentView('detail')
  }

  const handleItemEdit = (item) => {
    setSelectedItem(item)
    setCurrentView('form')
  }

  const handleItemCreate = () => {
    setSelectedItem(null)
    setCurrentView('form')
  }

  const handleFormSuccess = () => {
    setCurrentView('list')
    setSelectedItem(null)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Users
        if (currentView === 'detail' && selectedItem) {
          return (
            <UserDetail
              userId={selectedItem.id}
              onBack={handleBackToList}
              onEdit={handleItemEdit}
            />
          )
        }
        if (currentView === 'form') {
          return (
            <UserForm
              user={selectedItem}
              onBack={handleBackToList}
              onSuccess={handleFormSuccess}
            />
          )
        }
        return (
          <UserList
            onUserSelect={handleItemSelect}
            onUserEdit={handleItemEdit}
            onUserCreate={handleItemCreate}
          />
        )

      case 1: // Roles
        return (
          <RoleList
            onRoleSelect={handleItemSelect}
            onRoleEdit={handleItemEdit}
            onRoleCreate={handleItemCreate}
          />
        )

      case 2: // Permissions
        return (
          <PermissionList
            onPermissionSelect={handleItemSelect}
            onPermissionEdit={handleItemEdit}
            onPermissionCreate={handleItemCreate}
          />
        )

      default:
        return null
    }
  }

  const getTabLabel = (label, count) => (
    <Box display="flex" alignItems="center" gap={1}>
      {label}
      {count !== undefined && (
        <Badge badgeContent={count} color="primary" max={999} />
      )}
    </Box>
  )

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Gestion des Utilisateurs & Permissions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez les utilisateurs, leurs rôles et les permissions de votre plateforme
        </Typography>
      </Box>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tab
            icon={<PeopleIcon />}
            label="Utilisateurs"
            iconPosition="start"
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
          <Tab
            icon={<SecurityIcon />}
            label="Rôles"
            iconPosition="start"
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
          <Tab
            icon={<VpnKeyIcon />}
            label="Permissions"
            iconPosition="start"
            sx={{ textTransform: 'none', fontSize: '1rem' }}
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {renderTabContent()}
      </Box>
    </Box>
  )
}

export default UserRolePermissionManagement
