'use client'

import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Shield as ShieldIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Verified as VerifiedIcon,
  Block as BlockIcon,
} from '@mui/icons-material'
import {
  useGetUserQuery,
  useUpdateUserMutation,
  useAssignRoleToUserMutation,
  useRemoveRoleFromUserMutation,
  useGetRolesQuery,
} from '../../../redux-store/services/userRolePermissionApi'

const UserDetail = ({ userId, onBack, onEdit }) => {
  const [roleDialogOpen, setRoleDialogOpen] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [removeRoleDialogOpen, setRemoveRoleDialogOpen] = useState(false)
  const [roleToRemove, setRoleToRemove] = useState(null)

  const {
    data: userResponse,
    isLoading,
    isError,
    error,
    refetch
  } = useGetUserQuery(userId)

  const { data: rolesResponse } = useGetRolesQuery({ limit: 100 })

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()
  const [assignRole, { isLoading: isAssigning }] = useAssignRoleToUserMutation()
  const [removeRole, { isLoading: isRemoving }] = useRemoveRoleFromUserMutation()

  const user = userResponse?.data
  const availableRoles = rolesResponse?.data || []

  const handleStatusToggle = async () => {
    try {
      await updateUser({
        id: userId,
        isActive: !user.isActive
      }).unwrap()
      refetch()
    } catch (error) {
      console.error('Failed to update user status:', error)
    }
  }

  const handleAssignRole = async () => {
    if (selectedRoleId) {
      try {
        await assignRole({
          userId: userId,
          roleId: parseInt(selectedRoleId)
        }).unwrap()
        setRoleDialogOpen(false)
        setSelectedRoleId('')
        refetch()
      } catch (error) {
        console.error('Failed to assign role:', error)
      }
    }
  }

  const handleRemoveRoleClick = (role) => {
    setRoleToRemove(role)
    setRemoveRoleDialogOpen(true)
  }

  const handleRemoveRoleConfirm = async () => {
    if (roleToRemove) {
      try {
        await removeRole({
          userId: userId,
          roleId: roleToRemove.id
        }).unwrap()
        setRemoveRoleDialogOpen(false)
        setRoleToRemove(null)
        refetch()
      } catch (error) {
        console.error('Failed to remove role:', error)
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Jamais'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusChip = () => {
    if (!user.isActive) {
      return <Chip label="Inactif" color="error" icon={<BlockIcon />} />
    }
    if (!user.isEmailVerified) {
      return <Chip label="Non vérifié" color="warning" icon={<EmailIcon />} />
    }
    return <Chip label="Actif" color="success" icon={<VerifiedIcon />} />
  }

  const getUnassignedRoles = () => {
    const userRoleIds = user?.userRoles || []
    return availableRoles.filter(role => 
      role.isActive && !userRoleIds.includes(role.id)
    )
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
        Erreur lors du chargement de l'utilisateur: {error?.data || error?.message}
      </Alert>
    )
  }

  if (!user) {
    return (
      <Alert severity="warning" sx={{ mb: 2 }}>
        Utilisateur non trouvé
      </Alert>
    )
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={onBack} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Détails de l'utilisateur
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={() => onEdit?.(user)}
        >
          Modifier
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* User Information */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                    mb: 2
                  }}
                >
                  {user.firstName?.[0] || user.email[0].toUpperCase()}
                </Avatar>
                <Typography variant="h5" fontWeight="bold" textAlign="center">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user.email
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  ID: {user.id}
                </Typography>
                {getStatusChip()}
              </Box>

              <Divider sx={{ my: 2 }} />

              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={user.email}
                  />
                </ListItem>
                
                {user.phone && (
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Téléphone" 
                      secondary={user.phone}
                    />
                  </ListItem>
                )}

                <ListItem>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Membre depuis" 
                    secondary={formatDate(user.createdAt)}
                  />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Dernière connexion" 
                    secondary={formatDate(user.lastLoginAt)}
                  />
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Status Controls */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Contrôles
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={user.isActive}
                      onChange={handleStatusToggle}
                      disabled={isUpdating}
                    />
                  }
                  label="Compte actif"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Roles and Permissions */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Statistics */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Statistiques
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="primary">
                        {user.stats?.rolesCount || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rôles
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="success.main">
                        {user.stats?.permissionsCount || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Permissions
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="info.main">
                        {user.stats?.tenantsCount || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Tenants
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Box textAlign="center">
                      <Typography variant="h4" color="warning.main">
                        {user.stats?.ordersCount || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Commandes
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Roles */}
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Rôles assignés ({user.roleDetails?.length || 0})
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setRoleDialogOpen(true)}
                    disabled={getUnassignedRoles().length === 0}
                  >
                    Assigner un rôle
                  </Button>
                </Box>

                {user.roleDetails && user.roleDetails.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Nom du rôle</TableCell>
                          <TableCell>Niveau</TableCell>
                          <TableCell>Priorité</TableCell>
                          <TableCell>Permissions</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {user.roleDetails.map((role) => (
                          <TableRow key={role.id}>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <BadgeIcon fontSize="small" />
                                <Typography variant="body2" fontWeight="medium">
                                  {role.name}
                                </Typography>
                                {role.isSystemRole && (
                                  <Chip label="Système" size="small" color="info" />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={role.level} 
                                size="small" 
                                variant="outlined"
                                color={
                                  role.level === 'platform' ? 'error' :
                                  role.level === 'tenant' ? 'warning' : 'default'
                                }
                              />
                            </TableCell>
                            <TableCell>{role.priority}</TableCell>
                            <TableCell>{role.permissionsCount || 0}</TableCell>
                            <TableCell align="center">
                              {!role.isSystemRole && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveRoleClick(role)}
                                >
                                  <RemoveIcon />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Alert severity="info">
                    Aucun rôle assigné à cet utilisateur
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Permissions */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Permissions effectives ({user.permissionDetails?.length || 0})
                </Typography>
                
                {user.permissionDetails && user.permissionDetails.length > 0 ? (
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {user.permissionDetails.map((permission) => (
                      <Chip
                        key={permission.id}
                        label={permission.name}
                        size="small"
                        icon={<ShieldIcon />}
                        variant="outlined"
                        color={permission.isActive ? 'primary' : 'default'}
                      />
                    ))}
                  </Box>
                ) : (
                  <Alert severity="warning">
                    Aucune permission effective pour cet utilisateur
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Assign Role Dialog */}
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)}>
        <DialogTitle>Assigner un rôle</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Sélectionner un rôle</InputLabel>
            <Select
              value={selectedRoleId}
              label="Sélectionner un rôle"
              onChange={(e) => setSelectedRoleId(e.target.value)}
            >
              {getUnassignedRoles().map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <BadgeIcon fontSize="small" />
                    {role.name}
                    <Chip 
                      label={role.level} 
                      size="small" 
                      variant="outlined"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleAssignRole}
            variant="contained"
            disabled={!selectedRoleId || isAssigning}
          >
            {isAssigning ? <CircularProgress size={20} /> : 'Assigner'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Remove Role Dialog */}
      <Dialog open={removeRoleDialogOpen} onClose={() => setRemoveRoleDialogOpen(false)}>
        <DialogTitle>Retirer le rôle</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir retirer le rôle{' '}
            <strong>{roleToRemove?.name}</strong> à cet utilisateur ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemoveRoleDialogOpen(false)}>Annuler</Button>
          <Button 
            onClick={handleRemoveRoleConfirm}
            color="error"
            variant="contained"
            disabled={isRemoving}
          >
            {isRemoving ? <CircularProgress size={20} /> : 'Retirer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserDetail
