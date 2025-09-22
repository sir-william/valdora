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
import RoleList from '../../../../views/user-role-permission/roles/RoleList'

const RolesPage = () => {
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
    // For now, we only have RoleList component
    // Detail and Form components can be added later
    return (
      <RoleList
        onRoleSelect={handleItemSelect}
        onRoleEdit={handleItemEdit}
        onRoleCreate={handleItemCreate}
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
          <Typography color="text.primary">Rôles</Typography>
        </Breadcrumbs>
      </Box>

      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Gestion des Rôles
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez les rôles et leurs permissions
        </Typography>
      </Box>

      {/* Content */}
      <Paper sx={{ p: 3 }}>
        {renderContent()}
      </Paper>
    </Box>
  )
}

export default RolesPage
