'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Chip,
  Paper,
} from '@mui/material'
import {
  AutoAwesome,
  Store,
  Palette,
  Preview,
  Publish,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import apiService from '../../services/api'

const steps = [
  'Configuration du site',
  'Personnalisation',
  'Génération IA',
  'Aperçu et Publication'
]

const industries = [
  { value: 'fashion', label: 'Mode et Vêtements' },
  { value: 'electronics', label: 'Électronique et Tech' },
  { value: 'beauty', label: 'Beauté et Cosmétiques' },
  { value: 'home', label: 'Maison et Décoration' },
  { value: 'sports', label: 'Sport et Fitness' },
  { value: 'food', label: 'Alimentation et Boissons' },
  { value: 'books', label: 'Livres et Médias' },
  { value: 'jewelry', label: 'Bijoux et Accessoires' },
]

const styles = [
  { value: 'modern', label: 'Moderne et Minimaliste' },
  { value: 'classic', label: 'Classique et Élégant' },
  { value: 'bold', label: 'Audacieux et Coloré' },
  { value: 'luxury', label: 'Luxe et Premium' },
  { value: 'casual', label: 'Décontracté et Convivial' },
]

const AiGenerationPage = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [generatedSite, setGeneratedSite] = useState(null)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    siteName: '',
    description: '',
    industry: '',
    style: '',
    targetAudience: '',
    features: [],
    colors: {
      primary: '#7367F0',
      secondary: '#6D788D',
      accent: '#28C76F'
    }
  })

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiService.generateSite({
        name: formData.siteName,
        description: formData.description,
        industry: formData.industry,
        style: formData.style,
        target_audience: formData.targetAudience,
        features: formData.features,
        colors: formData.colors
      })
      
      setGeneratedSite(response)
      handleNext()
    } catch (err) {
      setError(`Erreur lors de la génération: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!generatedSite?.id) return
    
    setLoading(true)
    try {
      await apiService.publishSite(generatedSite.id)
      // Rediriger vers la liste des sites ou afficher un message de succès
    } catch (err) {
      setError(`Erreur lors de la publication: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom du site"
                  value={formData.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                  placeholder="Ex: Ma Boutique Mode"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description du site"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Décrivez votre boutique, vos produits et votre vision..."
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Secteur d'activité</InputLabel>
                  <Select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                  >
                    {industries.map((industry) => (
                      <MenuItem key={industry.value} value={industry.value}>
                        {industry.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Public cible"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="Ex: Femmes 25-45 ans, urbaines, actives"
                />
              </Grid>
            </Grid>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Style de design</InputLabel>
                  <Select
                    value={formData.style}
                    onChange={(e) => handleInputChange('style', e.target.value)}
                  >
                    {styles.map((style) => (
                      <MenuItem key={style.value} value={style.value}>
                        {style.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Couleurs du thème
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Couleur principale"
                      type="color"
                      value={formData.colors.primary}
                      onChange={(e) => handleInputChange('colors', {
                        ...formData.colors,
                        primary: e.target.value
                      })}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Couleur secondaire"
                      type="color"
                      value={formData.colors.secondary}
                      onChange={(e) => handleInputChange('colors', {
                        ...formData.colors,
                        secondary: e.target.value
                      })}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      label="Couleur d'accent"
                      type="color"
                      value={formData.colors.accent}
                      onChange={(e) => handleInputChange('colors', {
                        ...formData.colors,
                        accent: e.target.value
                      })}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <AutoAwesome sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Génération de votre site avec l'IA
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Notre intelligence artificielle va créer un site e-commerce personnalisé
                basé sur vos préférences et votre secteur d'activité.
              </Typography>
              
              {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <CircularProgress size={60} />
                  <Typography variant="body2">
                    Génération en cours... Cela peut prendre quelques minutes.
                  </Typography>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<AutoAwesome />}
                  onClick={handleGenerate}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    },
                  }}
                >
                  Générer mon site
                </Button>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mt: 3 }}>
                  {error}
                </Alert>
              )}
            </Box>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {generatedSite ? (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Votre site a été généré avec succès !
                </Typography>
                
                <Paper sx={{ p: 3, mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
                  <Typography variant="h6" gutterBottom>
                    {generatedSite.name || formData.siteName}
                  </Typography>
                  <Typography variant="body2">
                    Site généré avec {generatedSite.pages?.length || 5} pages
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label={`Secteur: ${formData.industry}`} size="small" />
                    <Chip label={`Style: ${formData.style}`} size="small" />
                    <Chip label="Responsive" size="small" />
                    <Chip label="SEO optimisé" size="small" />
                  </Box>
                </Paper>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Preview />}
                      onClick={() => {
                        // Ouvrir l'aperçu dans un nouvel onglet
                        window.open(generatedSite.preview_url, '_blank')
                      }}
                    >
                      Aperçu du site
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Publish />}
                      onClick={handlePublish}
                      disabled={loading}
                    >
                      {loading ? 'Publication...' : 'Publier le site'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ) : (
              <Alert severity="info">
                Aucun site généré. Veuillez retourner à l'étape précédente.
              </Alert>
            )}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Génération de Site avec IA
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Créez votre boutique en ligne en quelques étapes grâce à notre intelligence artificielle
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ minHeight: 400 }}>
            <AnimatePresence mode="wait">
              {renderStepContent(activeStep)}
            </AnimatePresence>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBack />}
            >
              Précédent
            </Button>
            
            {activeStep < steps.length - 1 && activeStep !== 2 && (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                disabled={
                  (activeStep === 0 && (!formData.siteName || !formData.industry)) ||
                  (activeStep === 1 && !formData.style)
                }
              >
                Suivant
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

export default AiGenerationPage

// Configuration pour la navigation automatique
export const navigationConfig = {
  label: 'Génération IA',
  icon: 'tabler-magic',
  section: 'Intelligence Artificielle',
  order: 15,
  enabled: true,
  permissions: ['user', 'admin'],
  description: 'Créez des boutiques en ligne avec l\'intelligence artificielle'
}
