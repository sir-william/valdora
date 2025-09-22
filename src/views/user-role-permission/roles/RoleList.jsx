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
  Security as SecurityIcon,
  Shield as ShieldIcon,
  Group as GroupIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'
import { useGetRolesQuery, useDeleteRoleMutation } from '../../../redux-store/services/userRolePermissionApi'

// Navigation configuration for auto-detection
export const navigationConfig = {
  enabled: true,
  section: 'Administration',
  label: 'Gestion des Rôles',
  icon: 'tabler-shield',
  order: 310,
  permissions: ['role.read.all', 'role.manage.all'],
  featureFlag: 'USER_ROLE_PERMISSION'
}

const RoleList = ({ onRoleSelect, onRoleCreate, onRoleEdit }) => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState(null)

  // Query parameters
  const queryParams = {
    page,
    limit: 10,
    ...(search && { search }),
    ...(levelFilter !== 'all' && { level: levelFilter }),
    ...(statusFilter !== 'all' && { isActive: statusFilter === 'active' }),
  }

  const {
    data: rolesResponse,
    isLoading,
    isError,
    error,
    refetch
  } = useGetRolesQuery(queryParams)

  const [deleteRole, { isLoading: isDeleting }] = useDeleteRoleMutation()

  const roles = rolesResponse?.data || []
  const meta = rolesResponse?.meta || { total: 0, totalPages: 1 }

  const handleDeleteClick = (role) => {
    setRoleToDelete(role)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (roleToDelete) {
      try {
        await deleteRole(roleToDelete.id).unwrap()
        setDeleteDialogOpen(false)
        setRoleToDelete(null)
        refetch()
      } catch (error) {
        console.error('Failed to delete role:', error)
      }
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setRoleToDelete(null)
  }

  const getLevelChip = (level) => {
    const levelConfig = {
      platform: { label: 'Plateforme', color: 'error' },
      tenant: { label: 'Tenant', color: 'warning' },
      user: { label: 'Utilisateur', color: 'info' },
    }
    
    const config = levelConfig[level] || { label: level, color: 'default' }
    return <Chip label={config.label} color={config.color} size="small" />
  }

  const getStatusChip = (role) => {
    if (!role.isActive) {
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
        Erreur lors du chargement des rôles: {error?.data || error?.message}
      </Alert>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Gestion des Rôles
        </Typography>
        <Button
          variant="contained"
          startIcon={<SecurityIcon />}
          onClick={onRoleCreate}
          sx={{ borderRadius: 2 }}
        >
          Nouveau Rôle
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Total Rôles
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
                Rôles Actifs
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {roles.filter(r => r.isActive).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Rôles Système
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {roles.filter(r => r.isSystemRole).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="body2">
                Permissions Moyennes
              </Typography>
              <Typography variant="h4" component="div" color="info.main">
                {roles.length > 0 
                  ? Math.round(roles.reduce((sum, r) => sum + (r.permissionsCount || 0), 0) / roles.length)
                  : 0
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Niveau</InputLabel>
                <Select
                  value={levelFilter}
                  label="Niveau"
                  onChange={(e) => setLevelFilter(e.target.value)}
                >
                  <MenuItem value="all">Tous</MenuItem>
                  <MenuItem value="platform">Plateforme</MenuItem>
                  <MenuItem value="tenant">Tenant</MenuItem>
                  <MenuItem value="user">Utilisateur</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={statusFilter}
                  label="Statut"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">Tous</MenuItem>
                  <MenuItem value="active">Actifs</MenuItem>
                  <MenuItem value="inactive">Inactifs</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearch('')
                  setLevelFilter('all')
                  setStatusFilter('all')
                }}
              >
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Roles Table */}
      <Card>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rôle</TableCell>
                <TableCell>Niveau</TableCell>
                <TableCell>Priorité</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Utilisateurs</TableCell>
                <TableCell>Créé le</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          bgcolor: role.isSystemRole ? 'warning.light' : 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {role.isSystemRole ? (
                          <WarningIcon color="warning" />
                        ) : (
                          <ShieldIcon color="primary" />
                        )}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {role.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {role.description || 'Aucune description'}
                        </Typography>
                        {role.isSystemRole && (
                          <Chip label="Système" size="small" color="warning" sx={{ mt: 0.5 }} />
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {getLevelChip(role.level)}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {role.priority}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {getStatusChip(role)}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ShieldIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {role.permissionsCount || 0}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <GroupIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {role.usersCount || 0}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(role.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Voir les détails">
                        <IconButton 
                          size="small" 
                          onClick={() => onRoleSelect?.(role)}
                          color="info"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Modifier">
                        <IconButton 
                          size="small" 
                          onClick={() => onRoleEdit?.(role)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {!role.isSystemRole && (
                        <Tooltip title="Supprimer">
                          <IconButton 
                            size="small" 
                            onClick={() => handleDeleteClick(role)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
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
            Êtes-vous sûr de vouloir supprimer le rôle{' '}
            <strong>{roleToDelete?.name}</strong> ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Cette action est irréversible et peut affecter les utilisateurs ayant ce rôle.
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

export default RoleList
