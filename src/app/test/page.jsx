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
} from '@mui/material'
import { motion } from 'framer-motion'

// Import VALDORA components
import LoginForm from '../../@core/components/auth/LoginForm'
import LogoutButton from '../../@core/components/auth/LogoutButton'
import DataTable from '../../@core/components/data/DataTable'
import AiStoreDraftList from '../../components/schemas/AiStoreDraft/AiStoreDraftList'
import AiStoreDraftWizard from '../../components/schemas/AiStoreDraft/AiStoreDraftWizard'
import OrderList from '../../components/schemas/Order/OrderList'

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

const TestPage = () => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleLoginSuccess = (result) => {
    console.log('Login successful:', result)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            VALDORA Frontend Test
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Test des composants et de l'intégration
          </Typography>
          <Alert severity="info" sx={{ mt: 2, maxWidth: 600, mx: 'auto' }}>
            Cette page permet de tester tous les composants VALDORA développés.
            Utilisez les onglets pour naviguer entre les différents modules.
          </Alert>
        </Box>
      </motion.div>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="test tabs">
            <Tab label="Authentification" />
            <Tab label="Data Table" />
            <Tab label="AI Store Drafts" />
            <Tab label="AI Wizard" />
            <Tab label="Orders" />
          </Tabs>
        </Box>

        {/* Authentication Tab */}
        <TabPanel value={tabValue} index={0}>
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
        <TabPanel value={tabValue} index={1}>
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
                onClick: (row) => console.log('View:', row)
              },
              {
                label: 'Modifier',
                icon: '✏️',
                onClick: (row) => console.log('Edit:', row)
              }
            ]}
            actions={[
              {
                label: 'Actualiser',
                icon: '🔄',
                onClick: () => console.log('Refresh')
              }
            ]}
            onRowClick={(row) => console.log('Row clicked:', row)}
          />
        </TabPanel>

        {/* AI Store Drafts Tab */}
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            Liste des brouillons AI Store
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Ce composant nécessite une connexion à l'API backend pour fonctionner correctement.
          </Alert>
          <AiStoreDraftList />
        </TabPanel>

        {/* AI Wizard Tab */}
        <TabPanel value={tabValue} index={3}>
          <Typography variant="h5" gutterBottom>
            Assistant de création AI Store
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Ce composant nécessite une connexion à l'API backend pour fonctionner correctement.
          </Alert>
          <AiStoreDraftWizard />
        </TabPanel>

        {/* Orders Tab */}
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h5" gutterBottom>
            Gestion des commandes
          </Typography>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Ce composant nécessite une connexion à l'API backend pour fonctionner correctement.
          </Alert>
          <OrderList />
        </TabPanel>
      </Card>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          VALDORA Frontend v1.0.0 - Développé avec Next.js, Material-UI et Redux Toolkit
        </Typography>
      </Box>
    </Container>
  )
}

export default TestPage
