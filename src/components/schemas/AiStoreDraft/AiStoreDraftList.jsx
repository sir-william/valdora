import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Alert,
  Fab,
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Publish,
  MoreVert,
  Store,
  AutoAwesome,
  TrendingUp,
  Schedule,
  CheckCircle,
  Error,
  Refresh,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useGetAiStoreDraftsQuery, useDeleteAiStoreDraftMutation } from '../../../redux-store/services/valdoraApi'
import DataTable from '../../../@core/components/data/DataTable'

// Status configuration
const statusConfig = {
  pending: {
    label: 'En attente',
    color: 'default',
    icon: Schedule,
    description: 'Brouillon créé, en attente de génération'
  },
  generating: {
    label: 'Génération en cours',
    color: 'info',
    icon: AutoAwesome,
    description: 'L\'IA génère le contenu de la boutique'
  },
  completed: {
    label: 'Terminé',
    color: 'success',
    icon: CheckCircle,
    description: 'Génération terminée avec succès'
  },
  failed: {
    label: 'Échec',
    color: 'error',
    icon: Error,
    description: 'Erreur lors de la génération'
  },
  published: {
    label: 'Publié',
    color: 'primary',
    icon: Publish,
    description: 'Boutique publiée et accessible'
  }
}

const AiStoreDraftList = () => {
  const router = useRouter()
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [orderBy, setOrderBy] = useState('createdAt')
  const [order, setOrder] = useState('desc')
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDraft, setSelectedDraft] = useState(null)

  // API calls
  const {
    data: draftsData,
    isLoading,
    error,
    refetch
  } = useGetAiStoreDraftsQuery({
    page: page + 1,
    limit: rowsPerPage,
    order: { [orderBy]: order },
    ...(searchValue && { search: searchValue }),
    ...(statusFilter && { status: statusFilter }),
  })

  const [deleteDraft, { isLoading: isDeleting }] = useDeleteAiStoreDraftMutation()

  // Memoized data
  const drafts = useMemo(() => {
    return draftsData?.['hydra:member'] || []
  }, [draftsData])

  const totalCount = useMemo(() => {
    return draftsData?.['hydra:totalItems'] || 0
  }, [draftsData])

  // Table columns
  const columns = [
    {
      field: 'storeName',
      headerName: 'Nom de la boutique',
      minWidth: 200,
      renderCell: ({ value, row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Store color="action" />
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {value || 'Sans nom'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.industry || 'Secteur non défini'}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Statut',
      minWidth: 150,
      renderCell: ({ value }) => {
        const config = statusConfig[value] || statusConfig.pending
        const IconComponent = config.icon
        
        return (
          <Chip
            icon={<IconComponent />}
            label={config.label}
            color={config.color}
            size="small"
            variant="outlined"
          />
        )
      }
    },
    {
      field: 'progress',
      headerName: 'Progression',
      minWidth: 150,
      renderCell: ({ value, row }) => {
        if (row.status === 'generating') {
          return (
            <Box sx={{ width: '100%' }}>
              <LinearProgress
                variant="determinate"
                value={value || 0}
                sx={{ mb: 0.5 }}
              />
              <Typography variant="caption" color="text.secondary">
                {value || 0}%
              </Typography>
            </Box>
          )
        }
        
        if (row.status === 'completed' || row.status === 'published') {
          return (
            <Chip
              label="100%"
              color="success"
              size="small"
            />
          )
        }
        
        return (
          <Typography variant="caption" color="text.secondary">
            -
          </Typography>
        )
      }
    },
    {
      field: 'createdAt',
      headerName: 'Créé le',
      type: 'date',
      minWidth: 120,
    },
    {
      field: 'updatedAt',
      headerName: 'Modifié le',
      type: 'date',
      minWidth: 120,
    }
  ]

  // Actions
  const handleCreateNew = () => {
    router.push('/ai-store/new')
  }

  const handleView = (draft) => {
    router.push(`/ai-store/${draft.id}`)
  }

  const handleEdit = (draft) => {
    router.push(`/ai-store/${draft.id}/edit`)
  }

  const handleDelete = (draft) => {
    setSelectedDraft(draft)
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (selectedDraft) {
      try {
        await deleteDraft(selectedDraft.id).unwrap()
        setDeleteDialogOpen(false)
        setSelectedDraft(null)
        refetch()
      } catch (error) {
        console.error('Delete error:', error)
      }
    }
  }

  const handlePublish = (draft) => {
    router.push(`/ai-store/${draft.id}/publish`)
  }

  // Row actions
  const rowActions = [
    {
      label: 'Voir',
      icon: <Visibility />,
      onClick: handleView
    },
    {
      label: 'Modifier',
      icon: <Edit />,
      onClick: handleEdit,
      disabled: (row) => row.status === 'generating'
    },
    {
      label: 'Publier',
      icon: <Publish />,
      onClick: handlePublish,
      disabled: (row) => row.status !== 'completed'
    },
    {
      label: 'Supprimer',
      icon: <Delete />,
      onClick: handleDelete,
      disabled: (row) => row.status === 'generating' || row.status === 'published'
    }
  ]

  // Table actions
  const tableActions = [
    {
      label: 'Actualiser',
      icon: <Refresh />,
      onClick: () => refetch(),
      tooltip: 'Actualiser la liste'
    }
  ]

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => refetch()}>
              Réessayer
            </Button>
          }
        >
          Erreur lors du chargement des brouillons : {error.message}
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Brouillons de boutiques IA
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gérez vos projets de boutiques générées par l'intelligence artificielle
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreateNew}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            },
          }}
        >
          Nouvelle boutique IA
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText'
                    }}
                  >
                    <Store />
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      {totalCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total brouillons
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'info.light',
                      color: 'info.contrastText'
                    }}
                  >
                    <AutoAwesome />
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      {drafts.filter(d => d.status === 'generating').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      En génération
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'success.light',
                      color: 'success.contrastText'
                    }}
                  >
                    <CheckCircle />
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      {drafts.filter(d => d.status === 'completed').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Terminés
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText'
                    }}
                  >
                    <Publish />
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      {drafts.filter(d => d.status === 'published').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Publiés
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <DataTable
            data={drafts}
            columns={columns}
            loading={isLoading}
            error={error}
            page={page}
            rowsPerPage={rowsPerPage}
            totalCount={totalCount}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            orderBy={orderBy}
            order={order}
            onSort={(field, direction) => {
              setOrderBy(field)
              setOrder(direction)
            }}
            searchable
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Rechercher par nom de boutique..."
            rowActions={rowActions}
            actions={tableActions}
            onRowClick={handleView}
            emptyMessage="Aucun brouillon de boutique trouvé. Créez votre première boutique IA !"
          />
        </Card>
      </motion.div>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="Créer une nouvelle boutique IA"
        onClick={handleCreateNew}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
          },
        }}
      >
        <Add />
      </Fab>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le brouillon "{selectedDraft?.storeName || 'Sans nom'}" ?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            variant="contained"
            color="error"
            startIcon={isDeleting ? <LinearProgress size={20} /> : <Delete />}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AiStoreDraftList
