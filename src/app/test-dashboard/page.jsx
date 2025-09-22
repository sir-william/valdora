'use client'

import { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material'
import { motion } from 'framer-motion'

import DashboardAnalytics from '../../components/dashboard/DashboardAnalytics'
import { config, logger } from '../../@core/utils/config'

// Import VALDORA components
import LoginForm from '../../@core/components/auth/LoginForm'
import LogoutButton from '../../@core/components/auth/LogoutButton'
import DataTable from '../../@core/components/data/DataTable'

// Mock data for testing
const mockTableData = [
  {
    id: 1,
    name: 'Boutique Mode',
    status: 'completed',
    createdAt: '2024-01-15',
    industry: 'fashion'
  },
  {
    id: 2,
    name: 'Tech Store',
    status: 'generating',
    createdAt: '2024-01-16',
    industry: 'electronics'
  },
  {
    id: 3,
    name: 'Beauty Shop',
    status: 'pending',
    createdAt: '2024-01-17',
    industry: 'beauty'
  }
]

const mockTableColumns = [
  { field: 'name', headerName: 'Nom', minWidth: 150 },
  { field: 'status', headerName: 'Statut', minWidth: 120 },
  { field: 'industry', headerName: 'Secteur', minWidth: 120 },
  { field: 'createdAt', headerName: 'Créé le', type: 'date', minWidth: 120 }
]

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`test-tabpanel-${index}`}
      aria-labelledby={`test-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  )
}

const TestDashboardPage = () => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleLoginSuccess = (result) => {
    console.log('Login successful:', result)
    logger.info('Login test successful', result)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom>
              VALDORA Test Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Test complet des composants avec sidebar et analytics
            </Typography>
            
            {/* Configuration Status */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`Mocks: ${config.mocks.enabled ? 'Activés' : 'Désactivés'}`}
                color={config.mocks.enabled ? 'success' : 'error'}
                variant="outlined"
              />
              <Chip
                label={`Sidebar: ${config.features.sidebar ? 'Activée' : 'Désactivée'}`}
                color={config.features.sidebar ? 'success' : 'error'}
                variant="outlined"
              />
              <Chip
                label={`Analytics: ${config.features.analytics ? 'Activées' : 'Désactivées'}`}
                color={config.features.analytics ? 'success' : 'error'}
                variant="outlined"
              />
              <Chip
                label={`Debug: ${config.dev.debugMode ? 'Activé' : 'Désactivé'}`}
                color={config.dev.debugMode ? 'info' : 'default'}
                variant="outlined"
              />
            </Box>
            
            <Alert severity="info" sx={{ mt: 2, maxWidth: 800, mx: 'auto' }}>
              Cette page permet de tester tous les composants VALDORA avec le nouveau layout sidebar.
              Les mocks sont configurables via le fichier .env.local.
            </Alert>
          </Box>
        </motion.div>

        {/* Tabs */}
        <Card sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="test tabs">
              <Tab label="Dashboard Analytics" />
              <Tab label="Authentification" />
              <Tab label="Data Table" />
              <Tab label="Configuration" />
            </Tabs>
          </Box>

          {/* Dashboard Analytics Tab */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" gutterBottom>
              Dashboard Analytics Complet
            </Typography>
            <Alert severity="success" sx={{ mb: 2 }}>
              Le dashboard analytics utilise les données mock configurées dans mockService.js
            </Alert>
            <Box sx={{ mt: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <DashboardAnalytics />
            </Box>
          </TabPanel>

          {/* Authentication Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Formulaire de connexion
                </Typography>
                <LoginForm onSuccess={handleLoginSuccess} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Boutons de déconnexion
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <LogoutButton variant="button" showConfirmDialog={false} />
                  <LogoutButton variant="icon" showConfirmDialog={false} />
                  <Card>
                    <CardContent>
                      <LogoutButton variant="menuItem" showConfirmDialog={false} />
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Data Table Tab */}
          <TabPanel value={tabValue} index={2}>
            <Typography variant="h5" gutterBottom>
              Composant DataTable
            </Typography>
            <DataTable
              data={mockTableData}
              columns={mockTableColumns}
              searchable
              selectable
              rowActions={[
                {
                  label: 'Voir',
                  icon: '👁️',
                  onClick: (row) => {
                    console.log('View:', row)
                    logger.info('DataTable view action', row)
                  }
                },
                {
                  label: 'Modifier',
                  icon: '✏️',
                  onClick: (row) => {
                    console.log('Edit:', row)
                    logger.info('DataTable edit action', row)
                  }
                }
              ]}
              actions={[
                {
                  label: 'Actualiser',
                  icon: '🔄',
                  onClick: () => {
                    console.log('Refresh')
                    logger.info('DataTable refresh action')
                  }
                }
              ]}
              onRowClick={(row) => {
                console.log('Row clicked:', row)
                logger.info('DataTable row click', row)
              }}
            />
          </TabPanel>

          {/* Configuration Tab */}
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h5" gutterBottom>
              Configuration VALDORA
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Configuration des Mocks
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Statut: {config.mocks.enabled ? 'Activés' : 'Désactivés'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Délai: {config.mocks.delay}ms
                        </Typography>
                      </Box>
                      <Alert severity="info" size="small">
                        Modifiez NEXT_PUBLIC_ENABLE_MOCKS dans .env.local pour activer/désactiver
                      </Alert>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Features Flags
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Sidebar:</Typography>
                        <Chip
                          label={config.features.sidebar ? 'ON' : 'OFF'}
                          color={config.features.sidebar ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Analytics:</Typography>
                        <Chip
                          label={config.features.analytics ? 'ON' : 'OFF'}
                          color={config.features.analytics ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Notifications:</Typography>
                        <Chip
                          label={config.features.notifications ? 'ON' : 'OFF'}
                          color={config.features.notifications ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Variables d'environnement
                    </Typography>
                    <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem', bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
                      <div>NEXT_PUBLIC_ENABLE_MOCKS={config.mocks.enabled.toString()}</div>
                      <div>NEXT_PUBLIC_MOCK_DELAY={config.mocks.delay}</div>
                      <div>NEXT_PUBLIC_API_BASE_URL={config.api.baseUrl}</div>
                      <div>NEXT_PUBLIC_ENABLE_ANALYTICS={config.features.analytics.toString()}</div>
                      <div>NEXT_PUBLIC_ENABLE_SIDEBAR={config.features.sidebar.toString()}</div>
                      <div>NEXT_PUBLIC_DEBUG_MODE={config.dev.debugMode.toString()}</div>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            VALDORA Frontend v2.0.0 - Sidebar Dashboard avec système de mocks configurable
          </Typography>
        </Box>
      </Container>
  )
}

export default TestDashboardPage
