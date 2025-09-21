import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Alert,
  LinearProgress,
  Divider,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Slider,
} from '@mui/material'
import {
  Store,
  Business,
  Quiz,
  Palette,
  Preview,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  Save,
  AutoAwesome,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useCreateAiStoreDraftMutation } from '../../../redux-store/services/valdoraApi'

// Validation schemas for each step
const stepSchemas = {
  basicInfo: z.object({
    storeName: z.string().min(1, 'Le nom de la boutique est requis').max(100, 'Maximum 100 caractères'),
    description: z.string().max(500, 'Maximum 500 caractères').optional(),
    targetAudience: z.string().min(1, 'Le public cible est requis'),
    businessModel: z.enum(['b2c', 'b2b', 'marketplace', 'subscription'], {
      required_error: 'Le modèle économique est requis'
    }),
  }),
  industry: z.object({
    industry: z.string().min(1, 'Le secteur d\'activité est requis'),
    subCategory: z.string().optional(),
    keywords: z.array(z.string()).min(1, 'Au moins un mot-clé est requis'),
  }),
  questionnaire: z.object({
    budget: z.number().min(0, 'Le budget doit être positif'),
    timeline: z.enum(['1-week', '2-weeks', '1-month', '3-months'], {
      required_error: 'La timeline est requise'
    }),
    features: z.array(z.string()).min(1, 'Au moins une fonctionnalité est requise'),
    integrations: z.array(z.string()).optional(),
  }),
  design: z.object({
    colorScheme: z.string().min(1, 'Le schéma de couleurs est requis'),
    style: z.enum(['modern', 'classic', 'minimalist', 'bold'], {
      required_error: 'Le style est requis'
    }),
    layout: z.enum(['grid', 'list', 'masonry'], {
      required_error: 'La mise en page est requise'
    }),
  }),
}

// Industries and categories
const industries = {
  'fashion': {
    label: 'Mode & Vêtements',
    subCategories: ['Vêtements femme', 'Vêtements homme', 'Accessoires', 'Chaussures', 'Bijoux']
  },
  'electronics': {
    label: 'Électronique & High-tech',
    subCategories: ['Smartphones', 'Ordinateurs', 'Audio/Vidéo', 'Gaming', 'Domotique']
  },
  'home': {
    label: 'Maison & Jardin',
    subCategories: ['Mobilier', 'Décoration', 'Électroménager', 'Jardinage', 'Bricolage']
  },
  'beauty': {
    label: 'Beauté & Cosmétiques',
    subCategories: ['Maquillage', 'Soins visage', 'Parfums', 'Soins cheveux', 'Bien-être']
  },
  'sports': {
    label: 'Sport & Loisirs',
    subCategories: ['Fitness', 'Sports outdoor', 'Équipements', 'Vêtements sport', 'Nutrition']
  },
  'food': {
    label: 'Alimentation & Boissons',
    subCategories: ['Épicerie fine', 'Bio', 'Vins', 'Pâtisserie', 'Produits locaux']
  }
}

// Available features
const availableFeatures = [
  'Catalogue produits',
  'Panier d\'achat',
  'Paiement en ligne',
  'Gestion des stocks',
  'Programme de fidélité',
  'Avis clients',
  'Chat en direct',
  'Blog intégré',
  'Newsletter',
  'Réseaux sociaux',
  'Analytics',
  'SEO optimisé'
]

// Available integrations
const availableIntegrations = [
  'PayPal',
  'Stripe',
  'Google Analytics',
  'Facebook Pixel',
  'Mailchimp',
  'Shopify',
  'WooCommerce',
  'Zapier',
  'Instagram',
  'TikTok'
]

const steps = [
  {
    label: 'Informations de base',
    description: 'Nom, description et modèle économique',
    icon: Store
  },
  {
    label: 'Secteur d\'activité',
    description: 'Industrie et mots-clés',
    icon: Business
  },
  {
    label: 'Questionnaire',
    description: 'Budget, timeline et fonctionnalités',
    icon: Quiz
  },
  {
    label: 'Design',
    description: 'Style et mise en page',
    icon: Palette
  },
  {
    label: 'Récapitulatif',
    description: 'Vérification et lancement',
    icon: Preview
  }
]

const AiStoreDraftWizard = () => {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({})
  const [keywords, setKeywords] = useState([])
  const [newKeyword, setNewKeyword] = useState('')

  const [createDraft, { isLoading: isCreating }] = useCreateAiStoreDraftMutation()

  // Form methods for current step
  const methods = useForm({
    resolver: zodResolver(stepSchemas[Object.keys(stepSchemas)[activeStep]] || z.object({})),
    mode: 'onChange'
  })

  const { handleSubmit, formState: { errors, isValid }, watch, setValue } = methods

  // Watch for changes
  const watchedValues = watch()

  // Handle next step
  const handleNext = async (data) => {
    // Save current step data
    setFormData(prev => ({ ...prev, ...data }))

    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1)
    } else {
      // Final step - create the draft
      await handleCreateDraft({ ...formData, ...data })
    }
  }

  // Handle back step
  const handleBack = () => {
    setActiveStep(prev => prev - 1)
  }

  // Create AI store draft
  const handleCreateDraft = async (finalData) => {
    try {
      const draftData = {
        storeName: finalData.storeName,
        description: finalData.description,
        industry: finalData.industry,
        subCategory: finalData.subCategory,
        targetAudience: finalData.targetAudience,
        businessModel: finalData.businessModel,
        keywords: finalData.keywords,
        budget: finalData.budget,
        timeline: finalData.timeline,
        features: finalData.features,
        integrations: finalData.integrations,
        design: {
          colorScheme: finalData.colorScheme,
          style: finalData.style,
          layout: finalData.layout,
        },
        status: 'pending'
      }

      const result = await createDraft(draftData).unwrap()
      router.push(`/ai-store/${result.id}`)
    } catch (error) {
      console.error('Create draft error:', error)
    }
  }

  // Add keyword
  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      const updatedKeywords = [...keywords, newKeyword.trim()]
      setKeywords(updatedKeywords)
      setValue('keywords', updatedKeywords)
      setNewKeyword('')
    }
  }

  // Remove keyword
  const handleRemoveKeyword = (keywordToRemove) => {
    const updatedKeywords = keywords.filter(k => k !== keywordToRemove)
    setKeywords(updatedKeywords)
    setValue('keywords', updatedKeywords)
  }

  // Render step content
  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Basic Info
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                {...methods.register('storeName')}
                fullWidth
                label="Nom de la boutique"
                error={!!errors.storeName}
                helperText={errors.storeName?.message}
                placeholder="Ex: Ma Boutique Mode"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...methods.register('description')}
                fullWidth
                multiline
                rows={3}
                label="Description (optionnel)"
                error={!!errors.description}
                helperText={errors.description?.message || 'Décrivez brièvement votre boutique'}
                placeholder="Une boutique moderne proposant..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...methods.register('targetAudience')}
                fullWidth
                label="Public cible"
                error={!!errors.targetAudience}
                helperText={errors.targetAudience?.message}
                placeholder="Ex: Femmes 25-45 ans, urbaines, actives"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.businessModel}>
                <InputLabel>Modèle économique</InputLabel>
                <Select
                  {...methods.register('businessModel')}
                  label="Modèle économique"
                  value={watchedValues.businessModel || ''}
                >
                  <MenuItem value="b2c">B2C - Vente aux particuliers</MenuItem>
                  <MenuItem value="b2b">B2B - Vente aux entreprises</MenuItem>
                  <MenuItem value="marketplace">Marketplace - Plateforme multi-vendeurs</MenuItem>
                  <MenuItem value="subscription">Abonnement - Modèle récurrent</MenuItem>
                </Select>
                {errors.businessModel && (
                  <FormHelperText>{errors.businessModel.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        )

      case 1: // Industry
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.industry}>
                <InputLabel>Secteur d'activité</InputLabel>
                <Select
                  {...methods.register('industry')}
                  label="Secteur d'activité"
                  value={watchedValues.industry || ''}
                  onChange={(e) => {
                    setValue('industry', e.target.value)
                    setValue('subCategory', '') // Reset subcategory
                  }}
                >
                  {Object.entries(industries).map(([key, industry]) => (
                    <MenuItem key={key} value={key}>
                      {industry.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.industry && (
                  <FormHelperText>{errors.industry.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            
            {watchedValues.industry && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Sous-catégorie (optionnel)</InputLabel>
                  <Select
                    {...methods.register('subCategory')}
                    label="Sous-catégorie (optionnel)"
                    value={watchedValues.subCategory || ''}
                  >
                    {industries[watchedValues.industry]?.subCategories.map((subCat) => (
                      <MenuItem key={subCat} value={subCat}>
                        {subCat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Mots-clés de votre activité
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  size="small"
                  label="Ajouter un mot-clé"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <Button variant="outlined" onClick={handleAddKeyword}>
                  Ajouter
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {keywords.map((keyword) => (
                  <Chip
                    key={keyword}
                    label={keyword}
                    onDelete={() => handleRemoveKeyword(keyword)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              {errors.keywords && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {errors.keywords.message}
                </Typography>
              )}
            </Grid>
          </Grid>
        )

      case 2: // Questionnaire
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Budget estimé (€)
              </Typography>
              <Slider
                {...methods.register('budget')}
                value={watchedValues.budget || 1000}
                onChange={(e, value) => setValue('budget', value)}
                min={500}
                max={50000}
                step={500}
                marks={[
                  { value: 500, label: '500€' },
                  { value: 5000, label: '5K€' },
                  { value: 25000, label: '25K€' },
                  { value: 50000, label: '50K€' }
                ]}
                valueLabelDisplay="on"
                valueLabelFormat={(value) => `${value.toLocaleString()}€`}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset" error={!!errors.timeline}>
                <Typography variant="subtitle2" gutterBottom>
                  Timeline de lancement
                </Typography>
                <RadioGroup
                  {...methods.register('timeline')}
                  value={watchedValues.timeline || ''}
                >
                  <FormControlLabel value="1-week" control={<Radio />} label="1 semaine - Lancement rapide" />
                  <FormControlLabel value="2-weeks" control={<Radio />} label="2 semaines - Standard" />
                  <FormControlLabel value="1-month" control={<Radio />} label="1 mois - Développement complet" />
                  <FormControlLabel value="3-months" control={<Radio />} label="3 mois - Projet complexe" />
                </RadioGroup>
                {errors.timeline && (
                  <FormHelperText>{errors.timeline.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Fonctionnalités souhaitées
              </Typography>
              <FormGroup>
                <Grid container>
                  {availableFeatures.map((feature) => (
                    <Grid item xs={12} sm={6} key={feature}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={watchedValues.features?.includes(feature) || false}
                            onChange={(e) => {
                              const currentFeatures = watchedValues.features || []
                              const newFeatures = e.target.checked
                                ? [...currentFeatures, feature]
                                : currentFeatures.filter(f => f !== feature)
                              setValue('features', newFeatures)
                            }}
                          />
                        }
                        label={feature}
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>
              {errors.features && (
                <Typography variant="caption" color="error">
                  {errors.features.message}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Intégrations tierces (optionnel)
              </Typography>
              <FormGroup>
                <Grid container>
                  {availableIntegrations.map((integration) => (
                    <Grid item xs={12} sm={6} key={integration}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={watchedValues.integrations?.includes(integration) || false}
                            onChange={(e) => {
                              const currentIntegrations = watchedValues.integrations || []
                              const newIntegrations = e.target.checked
                                ? [...currentIntegrations, integration]
                                : currentIntegrations.filter(i => i !== integration)
                              setValue('integrations', newIntegrations)
                            }}
                          />
                        }
                        label={integration}
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>
            </Grid>
          </Grid>
        )

      case 3: // Design
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                {...methods.register('colorScheme')}
                fullWidth
                label="Schéma de couleurs"
                error={!!errors.colorScheme}
                helperText={errors.colorScheme?.message || 'Ex: Bleu et blanc, Tons chauds, Minimaliste noir/blanc'}
                placeholder="Décrivez les couleurs souhaitées"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset" error={!!errors.style}>
                <Typography variant="subtitle2" gutterBottom>
                  Style de design
                </Typography>
                <RadioGroup
                  {...methods.register('style')}
                  value={watchedValues.style || ''}
                >
                  <FormControlLabel value="modern" control={<Radio />} label="Moderne - Design contemporain et épuré" />
                  <FormControlLabel value="classic" control={<Radio />} label="Classique - Élégant et intemporel" />
                  <FormControlLabel value="minimalist" control={<Radio />} label="Minimaliste - Simple et fonctionnel" />
                  <FormControlLabel value="bold" control={<Radio />} label="Audacieux - Créatif et original" />
                </RadioGroup>
                {errors.style && (
                  <FormHelperText>{errors.style.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset" error={!!errors.layout}>
                <Typography variant="subtitle2" gutterBottom>
                  Mise en page des produits
                </Typography>
                <RadioGroup
                  {...methods.register('layout')}
                  value={watchedValues.layout || ''}
                >
                  <FormControlLabel value="grid" control={<Radio />} label="Grille - Disposition en cartes régulières" />
                  <FormControlLabel value="list" control={<Radio />} label="Liste - Affichage vertical détaillé" />
                  <FormControlLabel value="masonry" control={<Radio />} label="Mosaïque - Disposition dynamique" />
                </RadioGroup>
                {errors.layout && (
                  <FormHelperText>{errors.layout.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        )

      case 4: // Review
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Récapitulatif de votre boutique IA
            </Typography>
            
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Informations de base
              </Typography>
              <Typography><strong>Nom :</strong> {formData.storeName}</Typography>
              <Typography><strong>Public cible :</strong> {formData.targetAudience}</Typography>
              <Typography><strong>Modèle :</strong> {formData.businessModel}</Typography>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Secteur d'activité
              </Typography>
              <Typography><strong>Industrie :</strong> {industries[formData.industry]?.label}</Typography>
              {formData.subCategory && (
                <Typography><strong>Sous-catégorie :</strong> {formData.subCategory}</Typography>
              )}
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2"><strong>Mots-clés :</strong></Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {formData.keywords?.map((keyword) => (
                    <Chip key={keyword} label={keyword} size="small" />
                  ))}
                </Box>
              </Box>
            </Paper>

            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Configuration
              </Typography>
              <Typography><strong>Budget :</strong> {formData.budget?.toLocaleString()}€</Typography>
              <Typography><strong>Timeline :</strong> {formData.timeline}</Typography>
              <Typography><strong>Fonctionnalités :</strong> {formData.features?.length} sélectionnées</Typography>
            </Paper>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                En cliquant sur "Lancer la génération", notre IA va créer votre boutique en ligne 
                personnalisée selon vos spécifications. Ce processus peut prendre quelques minutes.
              </Typography>
            </Alert>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Créer une boutique IA
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Laissez notre intelligence artificielle créer votre boutique en ligne personnalisée
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 800, mx: 'auto' }}>
        <CardContent sx={{ p: 4 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => {
              const StepIcon = step.icon
              return (
                <Step key={step.label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: index <= activeStep ? 'primary.main' : 'grey.300',
                          color: index <= activeStep ? 'white' : 'grey.600',
                        }}
                      >
                        <StepIcon />
                      </Box>
                    )}
                  >
                    <Typography variant="h6">{step.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <FormProvider {...methods}>
                      <Box component="form" onSubmit={handleSubmit(handleNext)}>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {renderStepContent(index)}
                        </motion.div>

                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                          <Button
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            startIcon={<ArrowBack />}
                          >
                            Précédent
                          </Button>
                          <Button
                            type="submit"
                            variant="contained"
                            disabled={!isValid || isCreating}
                            endIcon={
                              activeStep === steps.length - 1 ? (
                                <AutoAwesome />
                              ) : (
                                <ArrowForward />
                              )
                            }
                            sx={{
                              background: activeStep === steps.length - 1 
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : undefined,
                              '&:hover': {
                                background: activeStep === steps.length - 1 
                                  ? 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                                  : undefined,
                              },
                            }}
                          >
                            {isCreating ? (
                              'Génération en cours...'
                            ) : activeStep === steps.length - 1 ? (
                              'Lancer la génération'
                            ) : (
                              'Suivant'
                            )}
                          </Button>
                        </Box>
                      </Box>
                    </FormProvider>
                  </StepContent>
                </Step>
              )
            })}
          </Stepper>

          {isCreating && (
            <Box sx={{ mt: 3 }}>
              <LinearProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                Notre IA génère votre boutique personnalisée...
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default AiStoreDraftWizard
