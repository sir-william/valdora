'use client'

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Business as BusinessIcon
} from '@mui/icons-material'
import {
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useGetTenantQuery
} from '@/redux-store/services/valdoraApiWithMocks'

// Schéma de validation étendu
const tenantSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  domain: z.string().url('Doit être une URL valide'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone invalide'),
  address: z.string().min(10, 'Adresse trop courte'),
  plan: z.enum(['basic', 'professional', 'enterprise'], {
    errorMap: () => ({ message: 'Veuillez sélectionner un plan' })
  }),
  maxUsers: z.number().min(1, 'Le nombre maximum d\'utilisateurs doit être supérieur à 0'),
  features: z.array(z.string()).min(1, 'Sélectionnez au moins une fonctionnalité'),
  paymentMethod: z.enum(['credit_card', 'bank_transfer', 'paypal'], {
    errorMap: () => ({ message: 'Veuillez sélectionner un mode de paiement' })
  })
})

const availableFeatures = [
  { id: 'analytics', label: 'Analytics' },
  { id: 'api_access', label: 'Accès API' },
  { id: 'custom_domain', label: 'Domaine personnalisé' },
  { id: 'priority_support', label: 'Support prioritaire' },
  { id: 'compliance_tools', label: 'Outils de conformité' },
  { id: 'advanced_reporting', label: 'Rapports avancés' },
  { id: 'white_labeling', label: 'Marque blanche' }
]

const planLimits = {
  basic: { maxUsers: 10, features: ['analytics'] },
  professional: { maxUsers: 50, features: ['analytics', 'api_access', 'custom_domain'] },
  enterprise: { maxUsers: 200, features: ['analytics', 'api_access', 'custom_domain', 'priority_support', 'compliance_tools'] }
}

const TenantForm = ({ tenantId = null, mode = 'create' }) => {
  const router = useRouter()
  const isEdit = mode === 'edit' && tenantId

  // Hooks pour les mutations
  const [createTenant, { isLoading: isCreating }] = useCreateTenantMutation()
  const [updateTenant, { isLoading: isUpdating }] = useUpdateTenantMutation()

  // Hook pour récupérer les données en mode édition
  const { data: tenantResponse, isLoading: isLoadingTenant } = useGetTenantQuery(tenantId, {
    skip: !isEdit
  })

  const tenant = tenantResponse?.data

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      name: '',
      domain: '',
      email: '',
      phone: '',
      address: '',
      plan: 'basic',
      maxUsers: 10,
      features: ['analytics'],
      paymentMethod: 'credit_card'
    },
    values: isEdit && tenant ? {
      name: tenant.name,
      domain: tenant.domain,
      email: tenant.email,
      phone: tenant.phone,
      address: tenant.address,
      plan: tenant.plan,
      maxUsers: tenant.maxUsers,
      features: tenant.features,
      paymentMethod: tenant.billingInfo?.paymentMethod || 'credit_card'
    } : undefined
  })

  const watchedPlan = watch('plan')
  const watchedFeatures = watch('features')

  // Mettre à jour les limites selon le plan sélectionné
  const handlePlanChange = (plan) => {
    const limits = planLimits[plan]
    setValue('maxUsers', limits.maxUsers)
    setValue('features', limits.features)
  }

  const onSubmit = async (formData) => {
    try {
      const tenantData = {
        ...formData,
        billingInfo: {
          paymentMethod: formData.paymentMethod,
          monthlyRevenue: 0,
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      }

      if (isEdit) {
        await updateTenant({ id: tenantId, ...tenantData }).unwrap()
        router.push(`/admin/tenants/${tenantId}`)
      } else {
        const result = await createTenant(tenantData).unwrap()
        router.push(`/admin/tenants/${result.data.id}`)
      }
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err)
    }
  }

  if (isEdit && isLoadingTenant) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isEdit && !tenant) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Tenant non trouvé.
      </Alert>
    )
  }

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
        <BusinessIcon sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          {isEdit ? `Modifier ${tenant?.name}` : 'Nouveau Tenant'}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={3}>
              {/* Informations de base */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Informations de base
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nom du tenant"
                      fullWidth
                      required
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
                      required
                      placeholder="https://example.com"
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
                      label="Email de contact"
                      fullWidth
                      required
                      type="email"
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
                      required
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
                      required
                      multiline
                      rows={3}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Configuration du plan
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="plan"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth required error={!!errors.plan}>
                      <InputLabel>Plan</InputLabel>
                      <Select
                        {...field}
                        label="Plan"
                        onChange={(e) => {
                          field.onChange(e)
                          handlePlanChange(e.target.value)
                        }}
                      >
                        <MenuItem value="basic">Basic</MenuItem>
                        <MenuItem value="professional">Professional</MenuItem>
                        <MenuItem value="enterprise">Enterprise</MenuItem>
                      </Select>
                      {errors.plan && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          {errors.plan.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="maxUsers"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Nombre maximum d'utilisateurs"
                      fullWidth
                      required
                      type="number"
                      inputProps={{ min: 1, max: planLimits[watchedPlan]?.maxUsers || 200 }}
                      error={!!errors.maxUsers}
                      helperText={errors.maxUsers?.message || `Maximum pour le plan ${watchedPlan}: ${planLimits[watchedPlan]?.maxUsers}`}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                  Fonctionnalités
                </Typography>
                <Controller
                  name="features"
                  control={control}
                  render={({ field }) => (
                    <Box>
                      <Grid container spacing={1}>
                        {availableFeatures.map((feature) => (
                          <Grid item xs={12} sm={6} md={4} key={feature.id}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={field.value.includes(feature.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      field.onChange([...field.value, feature.id])
                                    } else {
                                      field.onChange(field.value.filter(f => f !== feature.id))
                                    }
                                  }}
                                />
                              }
                              label={feature.label}
                            />
                          </Grid>
                        ))}
                      </Grid>
                      {errors.features && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          {errors.features.message}
                        </Typography>
                      )}
                    </Box>
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Facturation
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="paymentMethod"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth required error={!!errors.paymentMethod}>
                      <InputLabel>Mode de paiement</InputLabel>
                      <Select {...field} label="Mode de paiement">
                        <MenuItem value="credit_card">Carte de crédit</MenuItem>
                        <MenuItem value="bank_transfer">Virement bancaire</MenuItem>
                        <MenuItem value="paypal">PayPal</MenuItem>
                      </Select>
                      {errors.paymentMethod && (
                        <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                          {errors.paymentMethod.message}
                        </Typography>
                      )}
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={isCreating || isUpdating}
                    size="large"
                  >
                    {isCreating || isUpdating ? (
                      <CircularProgress size={24} />
                    ) : (
                      isEdit ? 'Mettre à jour' : 'Créer le tenant'
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/admin/tenants')}
                    size="large"
                  >
                    Annuler
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default TenantForm
