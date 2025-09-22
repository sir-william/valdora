'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material'
import Link from 'next/link'
import { NavigateNext as NavigateNextIcon } from '@mui/icons-material'

// Import components
import UserList from '../../../../views/user-role-permission/users/UserList'
import UserDetail from '../../../../views/user-role-permission/users/UserDetail'
import UserForm from '../../../../views/user-role-permission/users/UserForm'

const UsersPage = () => {
  const [currentView, setCurrentView] = useState('list') // list, detail, form
  const [selectedItem, setSelectedItem] = useState(null)

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

  const renderContent = () => {
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
  }

  return (
    <Box>
      {/* Breadcrumbs */}
      <Box mb={2}>
        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link href="/admin/user-management" passHref>
            <MuiLink underline="hover" color="inherit">
              Gestion Utilisateurs
            </MuiLink>
          </Link>
          <Typography color="text.primary">Utilisateurs</Typography>
        </Breadcrumbs>
      </Box>

      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Gestion des Utilisateurs
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez les utilisateurs de votre plateforme
        </Typography>
      </Box>

      {/* Content */}
      <Paper sx={{ p: 3 }}>
        {renderContent()}
      </Paper>
    </Box>
  )
}

export default UsersPage
