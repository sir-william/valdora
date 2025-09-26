'use client'

import { useState, useEffect } from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Grid,
  Chip,
  TextField,
} from '@mui/material'
import {
  CheckCircle,
  Error,
  Api,
  Login,
  Storage,
} from '@mui/icons-material'
import apiService from '../../services/api'

const ApiTestPage = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing')
  const [loginStatus, setLoginStatus] = useState('idle')
  const [draftsStatus, setDraftsStatus] = useState('idle')
  const [testResults, setTestResults] = useState({})
  const [credentials, setCredentials] = useState({
    email: 'test@valdora.com',
    password: 'password'
  })

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    setConnectionStatus('testing')
    try {
      const isConnected = await apiService.testConnection()
      setConnectionStatus(isConnected ? 'success' : 'error')
      setTestResults(prev => ({
        ...prev,
        connection: isConnected ? 'Connexion réussie' : 'Connexion échouée'
      }))
    } catch (error) {
      setConnectionStatus('error')
      setTestResults(prev => ({
        ...prev,
        connection: `Erreur: ${error.message}`
      }))
    }
  }

  const testLogin = async () => {
    setLoginStatus('testing')
    try {
      const response = await apiService.login(credentials.email, credentials.password)
      setLoginStatus('success')
      setTestResults(prev => ({
        ...prev,
        login: 'Authentification réussie',
        token: response.token ? 'Token reçu' : 'Pas de token'
      }))
    } catch (error) {
      setLoginStatus('error')
      setTestResults(prev => ({
        ...prev,
        login: `Erreur d'authentification: ${error.message}`
      }))
    }
  }

  const testAiDrafts = async () => {
    setDraftsStatus('testing')
    try {
      const drafts = await apiService.getAiDrafts()
      setDraftsStatus('success')
      setTestResults(prev => ({
        ...prev,
        drafts: `${Array.isArray(drafts) ? drafts.length : 0} brouillons trouvés`
      }))
    } catch (error) {
      setDraftsStatus('error')
      setTestResults(prev => ({
        ...prev,
        drafts: `Erreur: ${error.message}`
      }))
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'testing':
        return <CircularProgress size={20} />
      case 'success':
        return <CheckCircle color="success" />
      case 'error':
        return <Error color="error" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'success'
      case 'error':
        return 'error'
      case 'testing':
        return 'info'
      default:
        return 'default'
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Test de Connexion API VALDORA
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Cette page teste la connexion entre le frontend Next.js et le backend Symfony.
      </Typography>

      <Grid container spacing={3}>
        {/* Test de Connexion */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Api color="primary" />
                <Typography variant="h6">Connexion Backend</Typography>
                {getStatusIcon(connectionStatus)}
              </Box>
              
              <Chip
                label={connectionStatus === 'testing' ? 'Test en cours...' : connectionStatus === 'success' ? 'Connecté' : 'Déconnecté'}
                color={getStatusColor(connectionStatus)}
                sx={{ mb: 2 }}
              />
              
              <Button
                variant="outlined"
                onClick={testConnection}
                disabled={connectionStatus === 'testing'}
                fullWidth
              >
                Tester la Connexion
              </Button>
              
              {testResults.connection && (
                <Alert severity={connectionStatus === 'success' ? 'success' : 'error'} sx={{ mt: 2 }}>
                  {testResults.connection}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Test d'Authentification */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Login color="primary" />
                <Typography variant="h6">Authentification</Typography>
                {getStatusIcon(loginStatus)}
              </Box>
              
              <TextField
                label="Email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                fullWidth
                size="small"
                sx={{ mb: 1 }}
              />
              
              <TextField
                label="Mot de passe"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                fullWidth
                size="small"
                sx={{ mb: 2 }}
              />
              
              <Button
                variant="outlined"
                onClick={testLogin}
                disabled={loginStatus === 'testing' || connectionStatus !== 'success'}
                fullWidth
              >
                Tester l'Authentification
              </Button>
              
              {testResults.login && (
                <Alert severity={loginStatus === 'success' ? 'success' : 'error'} sx={{ mt: 2 }}>
                  {testResults.login}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Test des Brouillons IA */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Storage color="primary" />
                <Typography variant="h6">Brouillons IA</Typography>
                {getStatusIcon(draftsStatus)}
              </Box>
              
              <Chip
                label={draftsStatus === 'testing' ? 'Test en cours...' : draftsStatus === 'success' ? 'Accessible' : 'Non accessible'}
                color={getStatusColor(draftsStatus)}
                sx={{ mb: 2 }}
              />
              
              <Button
                variant="outlined"
                onClick={testAiDrafts}
                disabled={draftsStatus === 'testing'}
                fullWidth
              >
                Tester les Brouillons IA
              </Button>
              
              {testResults.drafts && (
                <Alert severity={draftsStatus === 'success' ? 'success' : 'error'} sx={{ mt: 2 }}>
                  {testResults.drafts}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Résultats détaillés */}
      {Object.keys(testResults).length > 0 && (
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Résultats des Tests
            </Typography>
            
            <Box component="pre" sx={{ 
              backgroundColor: 'grey.100', 
              p: 2, 
              borderRadius: 1, 
              overflow: 'auto',
              fontSize: '0.875rem'
            }}>
              {JSON.stringify(testResults, null, 2)}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Informations de Configuration */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Configuration
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Backend URL:
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                {process.env.NEXT_PUBLIC_API_BASE_URL || 'https://8000-ixcibwvst312itne63t09-5050bf6c.manusvm.computer'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Frontend URL:
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  )
}

export default ApiTestPage

// Configuration pour la navigation automatique
export const navigationConfig = {
  label: 'Test API',
  icon: 'tabler-flask',
  section: 'Développement',
  order: 80,
  enabled: true,
  permissions: ['admin', 'developer'],
  description: 'Test de connectivité et authentification API'
}
