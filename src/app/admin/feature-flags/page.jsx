'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import {
  Settings,
  Save,
  Refresh,
  Download,
  Upload,
  ExpandMore,
  Info,
  Warning,
  CheckCircle,
  Error,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import {
  getAllFeatureFlags,
  getEnabledFeatures,
  getDisabledFeatures,
  generateEnvFile,
  defaultFeatureFlags,
  isFeatureEnabled,
} from '../../../@core/utils/featureFlags'

const FeatureFlagsPage = () => {
  const [flags, setFlags] = useState({})
  const [originalFlags, setOriginalFlags] = useState({})
  const [hasChanges, setHasChanges] = useState(false)
  const [showEnvDialog, setShowEnvDialog] = useState(false)
  const [envContent, setEnvContent] = useState('')

  // Descriptions des feature flags
  const flagDescriptions = {
    AI_GENERATION: 'Fonctionnalité de génération de sites avec IA',
    AI_DRAFTS: 'Gestion des brouillons de sites IA',
    ANALYTICS: 'Dashboard analytics de base',
    ADVANCED_ANALYTICS: 'Analytics avancées avec graphiques détaillés',
    PRODUCTS: 'Gestion des produits e-commerce',
    ORDERS: 'Gestion des commandes',
    INVENTORY: 'Gestion des stocks',
    TENANTS: 'Gestion multi-tenant',
    USER_MANAGEMENT: 'Gestion des utilisateurs',
    ROLES_PERMISSIONS: 'Système de rôles et permissions',
    DEMO_COMPONENTS: 'Composants de démonstration',
    API_TEST: 'Page de test des APIs',
    NOTIFICATIONS: 'Système de notifications',
    REAL_TIME: 'Fonctionnalités temps réel',
    EXPORT_DATA: 'Export de données',
    ENABLE_MOCKS: 'Données mock pour le développement',
    DEBUG_MODE: 'Mode debug avancé',
  }

  // Catégories des feature flags
  const flagCategories = {
    'Intelligence Artificielle': ['AI_GENERATION', 'AI_DRAFTS'],
    'Analytics & Reporting': ['ANALYTICS', 'ADVANCED_ANALYTICS'],
    'E-commerce': ['PRODUCTS', 'ORDERS', 'INVENTORY'],
    'Administration': ['TENANTS', 'USER_MANAGEMENT', 'ROLES_PERMISSIONS'],
    'Développement': ['DEMO_COMPONENTS', 'API_TEST', 'ENABLE_MOCKS', 'DEBUG_MODE'],
    'Fonctionnalités Avancées': ['NOTIFICATIONS', 'REAL_TIME', 'EXPORT_DATA'],
  }

  useEffect(() => {
    loadFeatureFlags()
  }, [])

  useEffect(() => {
    const changed = JSON.stringify(flags) !== JSON.stringify(originalFlags)
    setHasChanges(changed)
  }, [flags, originalFlags])

  const loadFeatureFlags = () => {
    const currentFlags = getAllFeatureFlags()
    setFlags(currentFlags)
    setOriginalFlags(currentFlags)
  }

  const handleFlagChange = (flagName, enabled) => {
    setFlags(prev => ({
      ...prev,
      [flagName]: enabled
    }))
  }

  const handleSave = () => {
    // Dans un vrai environnement, ceci ferait un appel API
    // pour sauvegarder les feature flags
    setOriginalFlags(flags)
    setHasChanges(false)
    
    // Générer le contenu .env.local
    const envContent = generateEnvFile(flags)
    console.log('Feature flags sauvegardés:', flags)
    console.log('Contenu .env.local généré:', envContent)
  }

  const handleReset = () => {
    setFlags(originalFlags)
  }

  const handleResetToDefaults = () => {
    setFlags(defaultFeatureFlags)
  }

  const handleGenerateEnv = () => {
    const content = generateEnvFile(flags)
    setEnvContent(content)
    setShowEnvDialog(true)
  }

  const getStatusColor = (enabled) => {
    return enabled ? 'success' : 'default'
  }

  const getStatusIcon = (enabled) => {
    return enabled ? <CheckCircle color="success" /> : <Error color="disabled" />
  }

  const enabledCount = getEnabledFeatures().length
  const totalCount = Object.keys(flags).length

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Feature Flags
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gérez l'activation et la désactivation des fonctionnalités de VALDORA
        </Typography>
      </Box>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                {enabledCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fonctionnalités Activées
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="text.secondary" sx={{ fontWeight: 700 }}>
                {totalCount - enabledCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fonctionnalités Désactivées
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" color="primary.main" sx={{ fontWeight: 700 }}>
                {Math.round((enabledCount / totalCount) * 100)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Taux d'Activation
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Actions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={!hasChanges}
            >
              Sauvegarder
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleReset}
              disabled={!hasChanges}
            >
              Annuler
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Settings />}
              onClick={handleResetToDefaults}
            >
              Valeurs par Défaut
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={handleGenerateEnv}
            >
              Générer .env.local
            </Button>
            
            {hasChanges && (
              <Chip
                label="Modifications non sauvegardées"
                color="warning"
                icon={<Warning />}
              />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Feature Flags par catégorie */}
      {Object.entries(flagCategories).map(([category, categoryFlags]) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Accordion defaultExpanded sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {category}
                </Typography>
                <Chip
                  label={`${categoryFlags.filter(flag => flags[flag]).length}/${categoryFlags.length}`}
                  size="small"
                  color="primary"
                />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {categoryFlags.map((flagName, index) => (
                  <ListItem key={flagName} divider={index < categoryFlags.length - 1}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusIcon(flags[flagName])}
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {flagName.replace(/_/g, ' ')}
                          </Typography>
                          <Chip
                            label={flags[flagName] ? 'Activé' : 'Désactivé'}
                            size="small"
                            color={getStatusColor(flags[flagName])}
                          />
                        </Box>
                      }
                      secondary={flagDescriptions[flagName] || 'Aucune description disponible'}
                    />
                    <ListItemSecondaryAction>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={flags[flagName] || false}
                            onChange={(e) => handleFlagChange(flagName, e.target.checked)}
                            color="primary"
                          />
                        }
                        label=""
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </motion.div>
      ))}

      {/* Dialog pour .env.local */}
      <Dialog
        open={showEnvDialog}
        onClose={() => setShowEnvDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Contenu du fichier .env.local
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Copiez ce contenu dans votre fichier .env.local pour appliquer les feature flags
          </Alert>
          <TextField
            multiline
            rows={20}
            value={envContent}
            fullWidth
            variant="outlined"
            InputProps={{
              readOnly: true,
              sx: { fontFamily: 'monospace', fontSize: '0.875rem' }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEnvDialog(false)}>
            Fermer
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              navigator.clipboard.writeText(envContent)
              // Ici on pourrait ajouter une notification de succès
            }}
          >
            Copier
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default FeatureFlagsPage

// Configuration pour la navigation automatique
export const navigationConfig = {
  label: 'Feature Flags',
  icon: 'tabler-settings',
  section: 'Administration',
  order: 90,
  enabled: true,
  permissions: ['admin'],
  description: 'Gestion des fonctionnalités et feature flags'
}
