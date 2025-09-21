'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material'
import {
  AutoAwesome,
  ShoppingCart,
  TrendingUp,
  Store,
  Add,
  Visibility,
  Dashboard,
} from '@mui/icons-material'
import { motion } from 'framer-motion'

const HomePage = () => {
  const router = useRouter()

  // Mock data for demonstration
  const stats = {
    totalStores: 12,
    activeOrders: 45,
    monthlyRevenue: 15420,
    aiDraftsInProgress: 3
  }

  const recentDrafts = [
    {
      id: 1,
      name: 'Boutique Mode Élégante',
      status: 'completed',
      progress: 100,
      industry: 'Fashion'
    },
    {
      id: 2,
      name: 'Tech Store Pro',
      status: 'generating',
      progress: 75,
      industry: 'Electronics'
    },
    {
      id: 3,
      name: 'Beauty Corner',
      status: 'pending',
      progress: 0,
      industry: 'Beauty'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success'
      case 'generating': return 'info'
      case 'pending': return 'warning'
      default: return 'default'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminé'
      case 'generating': return 'En génération'
      case 'pending': return 'En attente'
      default: return status
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Bienvenue sur VALDORA
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Votre plateforme SaaS pour créer des boutiques en ligne avec l'IA
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<AutoAwesome />}
                onClick={() => router.push('/test')}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  },
                }}
              >
                Tester les composants
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<Dashboard />}
                onClick={() => router.push('/dashboard')}
              >
                Accéder au dashboard
              </Button>
            </Box>
          </Box>
        </motion.div>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <Store />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.totalStores}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Boutiques créées
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
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.main' }}>
                      <ShoppingCart />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.activeOrders}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Commandes actives
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
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <TrendingUp />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.monthlyRevenue.toLocaleString()}€
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        CA mensuel
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
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <AutoAwesome />
                    </Avatar>
                    <Box>
                      <Typography variant="h4" component="div">
                        {stats.aiDraftsInProgress}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        IA en cours
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Recent AI Drafts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2">
                  Brouillons récents
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => router.push('/test')}
                >
                  Nouvelle boutique IA
                </Button>
              </Box>

              <Grid container spacing={3}>
                {recentDrafts.map((draft, index) => (
                  <Grid item xs={12} md={4} key={draft.id}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    >
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                            <Typography variant="h6" component="h3">
                              {draft.name}
                            </Typography>
                            <Chip
                              label={getStatusLabel(draft.status)}
                              color={getStatusColor(draft.status)}
                              size="small"
                            />
                          </Box>
                          
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Secteur: {draft.industry}
                          </Typography>

                          {draft.status === 'generating' && (
                            <Box sx={{ mt: 2 }}>
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
                        </CardContent>
                        
                        <CardActions>
                          <Button
                            size="small"
                            startIcon={<Visibility />}
                            onClick={() => router.push('/test')}
                          >
                            Voir détails
                          </Button>
                        </CardActions>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            VALDORA v1.0.0 - Plateforme SaaS E-commerce avec Intelligence Artificielle
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

export default HomePage
