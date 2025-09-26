'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Fab,
  TextField,
  InputAdornment,
} from '@mui/material'
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Preview,
  Publish,
  Search,
  FilterList,
  AutoAwesome,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import apiService from '../../services/api'

const AiDraftsPage = () => {
  const router = useRouter()
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDraft, setSelectedDraft] = useState(null)
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Mock data pour la démonstration
  const mockDrafts = [
    {
      id: 1,
      name: 'Boutique Mode Élégante',
      description: 'Site e-commerce pour vêtements féminins haut de gamme',
      industry: 'fashion',
      status: 'completed',
      progress: 100,
      created_at: '2025-09-25T10:30:00Z',
      updated_at: '2025-09-25T14:45:00Z',
      preview_url: '#',
      pages_count: 8,
      style: 'luxury'
    },
    {
      id: 2,
      name: 'Tech Store Pro',
      description: 'Boutique spécialisée en électronique et gadgets tech',
      industry: 'electronics',
      status: 'generating',
      progress: 75,
      created_at: '2025-09-25T15:20:00Z',
      updated_at: '2025-09-25T16:10:00Z',
      preview_url: null,
      pages_count: 0,
      style: 'modern'
    },
    {
      id: 3,
      name: 'Beauty Corner',
      description: 'Cosmétiques et produits de beauté naturels',
      industry: 'beauty',
      status: 'draft',
      progress: 25,
      created_at: '2025-09-24T09:15:00Z',
      updated_at: '2025-09-24T09:15:00Z',
      preview_url: null,
      pages_count: 0,
      style: 'modern'
    },
    {
      id: 4,
      name: 'Sports & Fitness Hub',
      description: 'Équipements sportifs et accessoires fitness',
      industry: 'sports',
      status: 'published',
      progress: 100,
      created_at: '2025-09-23T14:30:00Z',
      updated_at: '2025-09-23T18:20:00Z',
      preview_url: '#',
      pages_count: 12,
      style: 'bold'
    }
  ]

  useEffect(() => {
    loadDrafts()
  }, [])

  const loadDrafts = async () => {
    setLoading(true)
    try {
      // Utiliser les données mock pour la démonstration
      // const response = await apiService.getAiDrafts()
      // setDrafts(response)
      
      // Simuler un délai de chargement
      setTimeout(() => {
        setDrafts(mockDrafts)
        setLoading(false)
      }, 1000)
    } catch (err) {
      setError(`Erreur lors du chargement: ${err.message}`)
      setLoading(false)
    }
  }

  const handleMenuOpen = (event, draft) => {
    setMenuAnchor(event.currentTarget)
    setSelectedDraft(draft)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setSelectedDraft(null)
  }

  const handleDelete = async () => {
    if (!selectedDraft) return
    
    try {
      await apiService.deleteAiDraft(selectedDraft.id)
      setDrafts(prev => prev.filter(d => d.id !== selectedDraft.id))
      setDeleteDialogOpen(false)
      handleMenuClose()
    } catch (err) {
      setError(`Erreur lors de la suppression: ${err.message}`)
    }
  }

  const handlePublish = async (draft) => {
    try {
      await apiService.publishSite(draft.id)
      // Mettre à jour le statut local
      setDrafts(prev => prev.map(d => 
        d.id === draft.id ? { ...d, status: 'published' } : d
      ))
    } catch (err) {
      setError(`Erreur lors de la publication: ${err.message}`)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'generating': return 'info'
      case 'published': return 'primary'
      case 'draft': return 'warning'
      default: return 'default'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminé'
      case 'generating': return 'En génération'
      case 'published': return 'Publié'
      case 'draft': return 'Brouillon'
      default: return status
    }
  }

  const getIndustryLabel = (industry) => {
    const industries = {
      fashion: 'Mode',
      electronics: 'Électronique',
      beauty: 'Beauté',
      sports: 'Sport',
      home: 'Maison',
      food: 'Alimentation'
    }
    return industries[industry] || industry
  }

  const filteredDrafts = drafts.filter(draft =>
    draft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    draft.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Brouillons IA
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez vos sites générés par intelligence artificielle
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Rechercher un brouillon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
              >
                Filtres
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Drafts Grid */}
      <Grid container spacing={3}>
        {filteredDrafts.map((draft, index) => (
          <Grid item xs={12} md={6} lg={4} key={draft.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ flex: 1 }}>
                      {draft.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, draft)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {draft.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip
                      label={getStatusLabel(draft.status)}
                      color={getStatusColor(draft.status)}
                      size="small"
                    />
                    <Chip
                      label={getIndustryLabel(draft.industry)}
                      variant="outlined"
                      size="small"
                    />
                    {draft.pages_count > 0 && (
                      <Chip
                        label={`${draft.pages_count} pages`}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Box>

                  {draft.status === 'generating' && (
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Progression</Typography>
                        <Typography variant="body2">{draft.progress}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={draft.progress}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    Créé le {new Date(draft.created_at).toLocaleDateString('fr-FR')}
                  </Typography>
                </CardContent>

                <CardActions>
                  {draft.status === 'completed' && (
                    <>
                      <Button
                        size="small"
                        startIcon={<Preview />}
                        onClick={() => window.open(draft.preview_url, '_blank')}
                      >
                        Aperçu
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Publish />}
                        onClick={() => handlePublish(draft)}
                      >
                        Publier
                      </Button>
                    </>
                  )}
                  {draft.status === 'draft' && (
                    <Button
                      size="small"
                      startIcon={<Edit />}
                      onClick={() => router.push(`/ai-generation?draft=${draft.id}`)}
                    >
                      Continuer
                    </Button>
                  )}
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Empty State */}
      {filteredDrafts.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <AutoAwesome sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Aucun brouillon trouvé
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchTerm ? 'Aucun résultat pour votre recherche.' : 'Commencez par créer votre premier site avec l\'IA.'}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/ai-generation')}
          >
            Créer un nouveau site
          </Button>
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => router.push('/ai-generation')}
      >
        <Add />
      </Fab>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          router.push(`/ai-generation?draft=${selectedDraft?.id}`)
          handleMenuClose()
        }}>
          <Edit sx={{ mr: 1 }} />
          Modifier
        </MenuItem>
        {selectedDraft?.preview_url && (
          <MenuItem onClick={() => {
            window.open(selectedDraft.preview_url, '_blank')
            handleMenuClose()
          }}>
            <Preview sx={{ mr: 1 }} />
            Aperçu
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          setDeleteDialogOpen(true)
          handleMenuClose()
        }}>
          <Delete sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer le brouillon "{selectedDraft?.name}" ?
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AiDraftsPage

// Configuration pour la navigation automatique
export const navigationConfig = {
  label: 'Brouillons IA',
  icon: 'tabler-file-text',
  section: 'Intelligence Artificielle',
  order: 16,
  enabled: true,
  permissions: ['user', 'admin'],
  description: 'Gérez vos brouillons de boutiques générées par IA'
}
