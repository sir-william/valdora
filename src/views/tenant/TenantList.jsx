'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Box,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  Stack
} from '@mui/material'
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon
} from '@mui/icons-material'
import { useGetTenantsQuery, useDeleteTenantMutation } from '@/redux-store/services/valdoraApiWithMocks'

const TenantList = () => {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedTenant, setSelectedTenant] = useState(null)

  const { data: tenantsResponse, error, isLoading, refetch } = useGetTenantsQuery({
    page,
    limit: 6,
    search,
    status: statusFilter
  })

  const [deleteTenant, { isLoading: isDeleting }] = useDeleteTenantMutation()

  const handleMenuOpen = (event, tenant) => {
    setAnchorEl(event.currentTarget)
    setSelectedTenant(tenant)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedTenant(null)
  }

  const handleView = () => {
    if (selectedTenant) {
      router.push(`/admin/tenants/${selectedTenant.id}`)
    }
    handleMenuClose()
  }

  const handleEdit = () => {
    if (selectedTenant) {
      router.push(`/admin/tenants/${selectedTenant.id}/edit`)
    }
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (selectedTenant && window.confirm(`Êtes-vous sûr de vouloir supprimer le tenant "${selectedTenant.name}" ?`)) {
      try {
        await deleteTenant(selectedTenant.id).unwrap()
        refetch()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
    handleMenuClose()
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success'
      case 'inactive': return 'default'
      case 'suspended': return 'error'
      default: return 'default'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Actif'
      case 'inactive': return 'Inactif'
      case 'suspended': return 'Suspendu'
      default: return status
    }
  }

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'enterprise': return 'primary'
      case 'professional': return 'secondary'
      case 'basic': return 'default'
      default: return 'default'
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Erreur lors du chargement des tenants. Veuillez réessayer.
      </Alert>
    )
  }

  const tenants = tenantsResponse?.data || []
  const totalPages = tenantsResponse?.totalPages || 1

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Gestion des Tenants
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => router.push('/admin/tenants/new')}
        >
          Nouveau Tenant
        </Button>
      </Box>

      {/* Filtres */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Rechercher par nom, domaine ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={statusFilter}
                  label="Statut"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value="active">Actif</MenuItem>
                  <MenuItem value="inactive">Inactif</MenuItem>
                  <MenuItem value="suspended">Suspendu</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearch('')
                  setStatusFilter('')
                  setPage(1)
                }}
                fullWidth
              >
                Réinitialiser
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Liste des tenants */}
      <Grid container spacing={3}>
        {tenants.map((tenant) => (
          <Grid item xs={12} md={6} lg={4} key={tenant.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <BusinessIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {tenant.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {tenant.id}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, tenant)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Domaine:</strong> {tenant.domain}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Email:</strong> {tenant.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Utilisateurs:</strong> {tenant.currentUsers}/{tenant.maxUsers}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    label={getStatusLabel(tenant.status)}
                    color={getStatusColor(tenant.status)}
                    size="small"
                  />
                  <Chip
                    label={tenant.plan.toUpperCase()}
                    color={getPlanColor(tenant.plan)}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary">
                  Créé le {new Date(tenant.createdAt).toLocaleDateString('fr-FR')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Menu contextuel */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ViewIcon sx={{ mr: 1 }} />
          Voir les détails
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} />
          Modifier
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {/* Message si aucun tenant */}
      {tenants.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Aucun tenant trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {search || statusFilter ? 'Essayez de modifier vos critères de recherche.' : 'Commencez par créer votre premier tenant.'}
          </Typography>
          {!search && !statusFilter && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => router.push('/admin/tenants/new')}
            >
              Créer un tenant
            </Button>
          )}
        </Box>
      )}
    </Box>
  )
}

export default TenantList
