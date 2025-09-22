'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  Box,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  LinearProgress
} from '@mui/material'
import {
  Business as BusinessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CreditCard as CreditCardIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material'
import {
  useGetTenantQuery,
  useUpdateTenantMutation,
  useDeleteTenantMutation
} from '@/redux-store/services/valdoraApiWithMocks'

// Schéma de validation
const tenantSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  domain: z.string().url('Doit être une URL valide'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  address: z.string().min(10, 'Adresse trop courte'),
})

const TenantDetail = ({ tenantId }) => {
  const router = useRouter()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const { data: tenantResponse, error, isLoading, isFetching } = useGetTenantQuery(tenantId)
  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation()
  const [deleteTenant, { isLoading: isDeleting }] = useDeleteTenantMutation()

  const tenant = tenantResponse?.data

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(tenantSchema),
    values: {
      name: tenant?.name || '',
      domain: tenant?.domain || '',
      email: tenant?.email || '',
      phone: tenant?.phone || '',
      address: tenant?.address || '',
    }
  })

  const handleStatusChange = async (event) => {
    const newStatus = event.target.checked ? 'active' : 'inactive'
    try {
      await updateTenant({ id: tenantId, status: newStatus }).unwrap()
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err)
    }
  }

  const onSubmit = async (formData) => {
    try {
      await updateTenant({ id: tenantId, ...formData }).unwrap()
      setIsEditing(false)
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTenant(tenantId).unwrap()
      router.push('/admin/tenants')
      setOpenDeleteDialog(false)
    } catch (err) {
      console.error('Erreur lors de la suppression:', err)
    }
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
        Erreur lors du chargement du tenant. Veuillez réessayer.
      </Alert>
    )
  }

  if (!tenant) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Tenant non trouvé.
      </Alert>
    )
  }

  const usagePercentage = (tenant.currentUsers / tenant.maxUsers) * 100

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin/tenants')}
          sx={{ mr: 2 }}
        >
          Retour
        </Button>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          <BusinessIcon />
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {tenant.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {tenant.id}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label={getStatusLabel(tenant.status)}
            color={getStatusColor(tenant.status)}
          />
          <Chip
            label={tenant.plan.toUpperCase()}
            color={getPlanColor(tenant.plan)}
            variant="outlined"
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Informations principales */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Informations du Tenant
                </Typography>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? 'outlined' : 'contained'}
                >
                  {isEditing ? 'Annuler' : 'Modifier'}
                </Button>
              </Box>

              {isEditing ? (
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Nom du tenant"
                            fullWidth
                            error={!!errors.name}
                            helperText={errors.name?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="domain"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Domaine"
                            fullWidth
                            error={!!errors.domain}
                            helperText={errors.domain?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Email"
                            fullWidth
                            error={!!errors.email}
                            helperText={errors.email?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Téléphone"
                            fullWidth
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Adresse"
                            fullWidth
                            multiline
                            rows={2}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isUpdating || isFetching}
                    >
                      {isUpdating ? <CircularProgress size={24} /> : 'Sauvegarder'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false)
                        reset()
                      }}
                    >
                      Annuler
                    </Button>
                  </Box>
                </Box>
              ) : (
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <BusinessIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Nom"
                      secondary={tenant.name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={tenant.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Téléphone"
                      secondary={tenant.phone}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Adresse"
                      secondary={tenant.address}
                    />
                  </ListItem>
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Statistiques et contrôles */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={2}>
            {/* Statut du tenant */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Statut du Tenant
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={tenant.status === 'active'}
                        onChange={handleStatusChange}
                        disabled={isUpdating || isFetching}
                      />
                    }
                    label={tenant.status === 'active' ? 'Tenant actif' : 'Tenant inactif'}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Désactiver un tenant empêche l'accès au service.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Utilisation */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Utilisation
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <PeopleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {tenant.currentUsers} / {tenant.maxUsers} utilisateurs
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={usagePercentage}
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {usagePercentage.toFixed(1)}% d'utilisation
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Facturation */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Facturation
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {tenant.billingInfo.monthlyRevenue.toFixed(2)}€
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Revenus mensuels
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Prochaine facturation: {new Date(tenant.billingInfo.nextBillingDate).toLocaleDateString('fr-FR')}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Fonctionnalités */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Fonctionnalités
                  </Typography>
                  <List dense>
                    {tenant.features.map((feature, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature.replace('_', ' ').toUpperCase()}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Zone de danger */}
        <Grid item xs={12}>
          <Card sx={{ borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
            <CardContent>
              <Typography variant="h6" color="error" gutterBottom sx={{ fontWeight: 600 }}>
                Zone de Danger
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                La suppression d'un tenant est irréversible et supprimera toutes les données associées.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setOpenDeleteDialog(true)}
                disabled={isDeleting}
              >
                Supprimer le tenant
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog de confirmation de suppression */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer le tenant "{tenant.name}" ? 
            Cette action est irréversible et supprimera toutes les données associées.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" disabled={isDeleting}>
            {isDeleting ? <CircularProgress size={24} /> : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TenantDetail
