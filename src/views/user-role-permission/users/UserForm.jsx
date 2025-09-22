'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  IconButton,
  Chip,
  Autocomplete,
  Stack,
  Divider,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Security as SecurityIcon,
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetRolesQuery,
} from '../../../redux-store/services/userRolePermissionApi'

// Validation schema
const userSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères').optional(),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  isActive: z.boolean(),
  userRoles: z.array(z.number()).min(1, 'Au moins un rôle doit être assigné'),
})

const UserForm = ({ user = null, onBack, onSuccess }) => {
  const isEditing = Boolean(user)
  const [submitError, setSubmitError] = useState('')

  const { data: rolesResponse } = useGetRolesQuery({ limit: 100 })
  const availableRoles = rolesResponse?.data || []

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation()
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      isActive: user?.isActive ?? true,
      userRoles: user?.userRoles || [5], // Default to ROLE_USER
    },
  })

  const selectedRoleIds = watch('userRoles')

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        isActive: user.isActive ?? true,
        userRoles: user.userRoles || [5],
      })
    }
  }, [user, reset])

  const onSubmit = async (data) => {
    try {
      setSubmitError('')
      
      if (isEditing) {
        await updateUser({
          id: user.id,
          ...data,
        }).unwrap()
      } else {
        await createUser(data).unwrap()
      }
      
      onSuccess?.()
    } catch (error) {
      setSubmitError(error?.data?.message || 'Une erreur est survenue')
    }
  }

  const getSelectedRoles = () => {
    return availableRoles.filter(role => selectedRoleIds.includes(role.id))
  }

  const isLoading = isCreating || isUpdating

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={onBack} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {isEditing ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur'}
          </Typography>
        </Box>
      </Box>

      {submitError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {submitError}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={3}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6">
                    Informations personnelles
                  </Typography>
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="firstName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Prénom"
                          error={!!errors.firstName}
                          helperText={errors.firstName?.message}
                        />
                      )}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="lastName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Nom"
                          error={!!errors.lastName}
                          helperText={errors.lastName?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Email"
                          type="email"
                          error={!!errors.email}
                          helperText={errors.email?.message}
                          InputProps={{
                            startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Téléphone"
                          error={!!errors.phone}
                          helperText={errors.phone?.message}
                          InputProps={{
                            startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                          }}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Settings and Roles */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              {/* Account Settings */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Paramètres du compte
                  </Typography>
                  
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        }
                        label="Compte actif"
                      />
                    )}
                  />
                </CardContent>
              </Card>

              {/* Role Assignment */}
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <SecurityIcon color="primary" />
                    <Typography variant="h6">
                      Rôles
                    </Typography>
                  </Box>

                  <Controller
                    name="userRoles"
                    control={control}
                    render={({ field }) => (
                      <Autocomplete
                        multiple
                        options={availableRoles.filter(role => role.isActive)}
                        getOptionLabel={(option) => option.name}
                        value={getSelectedRoles()}
                        onChange={(event, newValue) => {
                          field.onChange(newValue.map(role => role.id))
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Sélectionner des rôles"
                            error={!!errors.userRoles}
                            helperText={errors.userRoles?.message}
                          />
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <Chip
                              variant="outlined"
                              label={option.name}
                              {...getTagProps({ index })}
                              key={option.id}
                              color={
                                option.level === 'platform' ? 'error' :
                                option.level === 'tenant' ? 'warning' : 'default'
                              }
                            />
                          ))
                        }
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {option.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {option.description} • Niveau: {option.level}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      />
                    )}
                  />

                  {getSelectedRoles().length > 0 && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Rôles sélectionnés:
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {getSelectedRoles().map((role) => (
                          <Chip
                            key={role.id}
                            label={role.name}
                            size="small"
                            color={
                              role.level === 'platform' ? 'error' :
                              role.level === 'tenant' ? 'warning' : 'default'
                            }
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Button
                    variant="outlined"
                    onClick={onBack}
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={isLoading}
                    size="large"
                  >
                    {isLoading 
                      ? (isEditing ? 'Modification...' : 'Création...') 
                      : (isEditing ? 'Modifier' : 'Créer')
                    }
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  )
}

export default UserForm
