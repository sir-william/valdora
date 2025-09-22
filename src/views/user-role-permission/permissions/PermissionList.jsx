'use client'

import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  Stack,
  Alert,
  CircularProgress,
  Pagination,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  FilterList as FilterIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  VpnKey as VpnKeyIcon,
  Group as GroupIcon,
} from '@mui/icons-material'
import { useGetPermissionsQuery, useDeletePermissionMutation } from '../../../redux-store/services/userRolePermissionApi'

// Navigation configuration for auto-detection
export const navigationConfig = {
  enabled: true,
  section: 'Administration',
  label: 'Gestion des Permissions',
  icon: 'tabler-key',
  order: 320,
  permissions: ['permission.read.all', 'permission.manage.all'],
  featureFlag: 'USER_ROLE_PERMISSION'
}

const PermissionList = ({ onPermissionSelect, onPermissionCreate, onPermissionEdit }) => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [actionFilter, setActionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [permissionToDelete, setPermissionToDelete] = useState(null)

  // Query parameters
  const queryParams = {
    page,
    limit: 10,
    ...(search && { search }),
    ...(categoryFilter !== 'all' && { category: categoryFilter }),
    ...(actionFilter !== 'all' && { action: actionFilter }),
    ...(statusFilter !== 'all' && { isActive: statusFilter === 'active' }),
  }

  const {
    data: permissionsResponse,
    isLoading,
    isError,
    error,
    refetch
  } = useGetPermissionsQuery(queryParams)

  const [deletePermission, { isLoading: isDeleting }] = useDeletePermissionMutation()

  const permissions = permissionsResponse?.data || []
  const meta = permissionsResponse?.meta || { total: 0, totalPages: 1 }

  // Get unique categories and actions for filters
  const categories = [...new Set(permissions.map(p => p.category).filter(Boolean))]
  const actions = [...new Set(permissions.map(p => p.action).filter(Boolean))]

  const handleDeleteClick = (permission) => {
    setPermissionToDelete(permission)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (permissionToDelete) {
      try {
        await deletePermission(permissionToDelete.id).unwrap()
        setDeleteDialogOpen(false)
        setPermissionToDelete(null)
        refetch()
      } catch (error) {
        console.error('Failed to delete permission:', error)
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setPermissionToDelete(null)
  }

  const getCategoryChip = (category) => {
    const categoryConfig = {
      user: { label: 'Utilisateur', color: 'primary' },
      role: { label: 'Rôle', color: 'secondary' },
      permission: { label: 'Permission', color: 'info' },
      tenant: { label: 'Tenant', color: 'warning' },
      system: { label: 'Système', color: 'error' },
    }
    
    const config = categoryConfig[category] || { label: category, color: 'default' }
    return <Chip label={config.label} color={config.color} size="small" />
  }

  const getActionChip = (action) => {
    const actionConfig = {
      create: { label: 'Créer', color: 'success' },
      read: { label: 'Lire', color: 'info' },
      update: { label: 'Modifier', color: 'warning' },
      delete: { label: 'Supprimer', color: 'error' },
      manage: { label: 'Gérer', color: 'primary' },
    }
    
    const config = actionConfig[action] || { label: action, color: 'default' }
    return <Chip label={config.label} color={config.color} size="small" variant="outlined" />
  }

  const getStatusChip = (permission) => {
    if (!permission.isActive) {
      return <Chip label="Inactif" color="error" size="small" />
    }
    return <Chip label="Actif" color="success" size="small" />
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Erreur lors du chargement des permissions: {error?.data || error?.message}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Gestion des Permissions
        </Typography>
        <Button
          variant="contained"
          startIcon={<VpnKeyIcon />}
          onClick={onPermissionCreate}
          sx={{ borderRadius: 2 }}
        >
          Nouvelle Permission
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Permissions
              </Typography>
              <Typography variant="h4" component="div">
                {meta.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Permissions Actives
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {permissions.filter(p => p.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Catégories
              </Typography>
              <Typography variant="h4" component="div" color="info.main">
                {categories.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Actions
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {actions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Rechercher par nom, description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={categoryFilter}
                  label="Catégorie"
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="all">Toutes</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Action</InputLabel>
                <Select
                  value={actionFilter}
                  label="Action"
                  onChange={(e) => setActionFilter(e.target.value)}
                >
                  <MenuItem value="all">Toutes</MenuItem>
                  {actions.map((action) => (
                    <MenuItem key={action} value={action}>
                      {action}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={statusFilter}
                  label="Statut"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tous</MenuItem>
                  <MenuItem value="active">Actives</MenuItem>
                  <MenuItem value="inactive">Inactives</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearch('')
                  setCategoryFilter('all')
                  setActionFilter('all')
                  setStatusFilter('all')
                }}
              >
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Permissions Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Permission</TableCell>
                <TableCell>Catégorie</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Rôles</TableCell>
                <TableCell>Créé le</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {permissions.map((permission) => (
                <TableRow key={permission.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <LockIcon color="primary" />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {permission.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {permission.description || 'Aucune description'}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {permission.category ? getCategoryChip(permission.category) : '-'}
                  </TableCell>
                  <TableCell>
                    {permission.action ? getActionChip(permission.action) : '-'}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(permission)}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <GroupIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {permission.rolesCount || 0}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(permission.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Voir les détails">
                        <IconButton 
                          size="small" 
                          onClick={() => onPermissionSelect?.(permission)}
                          color="info"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton 
                          size="small" 
                          onClick={() => onPermissionEdit?.(permission)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteClick(permission)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <Box display="flex" justifyContent="center" p={2}>
            <Pagination
              count={meta.totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer la permission{' '}
            <strong>{permissionToDelete?.name}</strong> ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Cette action est irréversible et peut affecter les rôles utilisant cette permission.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Annuler</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={20} /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default PermissionList
