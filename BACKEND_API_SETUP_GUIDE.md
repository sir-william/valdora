# Guide de Configuration API Backend - VALDORA

## 📋 Vue d'Ensemble

Ce guide détaille comment configurer VALDORA pour se connecter à une API backend réelle, en remplaçant le système de mocks par des appels API authentiques.

## 🎯 Objectifs

- ✅ Configurer la connexion à l'API backend
- ✅ Remplacer les mocks par des appels API réels
- ✅ Gérer l'authentification et les tokens
- ✅ Implémenter la gestion d'erreurs
- ✅ Optimiser les performances avec le cache
- ✅ Configurer les environnements (dev, staging, prod)

## 📁 Structure API Actuelle

```
src/
├── redux-store/
│   └── services/
│       ├── valdoraApi.js              # API de base (à configurer)
│       └── valdoraApiWithMocks.js     # API avec mocks (actuelle)
├── @core/
│   └── services/
│       └── mockService.js             # Service de mocks (à désactiver)
└── config/
    └── api/                           # 🆕 Configuration API (à créer)
```

## 🚀 Étape 1 : Configuration des Variables d'Environnement

### 1.1 Créer les Fichiers d'Environnement

#### **Développement** (`.env.local`)
```bash
# ===== CONFIGURATION API BACKEND =====
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_API_TIMEOUT=30000

# ===== AUTHENTIFICATION =====
NEXT_PUBLIC_AUTH_ENABLED=true
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret-key
NEXT_PUBLIC_TOKEN_STORAGE_KEY=valdora_auth_token
NEXT_PUBLIC_REFRESH_TOKEN_KEY=valdora_refresh_token

# ===== FEATURES FLAGS =====
NEXT_PUBLIC_ENABLE_MOCKS=false          # 🔴 Désactiver les mocks
NEXT_PUBLIC_ENABLE_API_CACHE=true
NEXT_PUBLIC_ENABLE_API_RETRY=true
NEXT_PUBLIC_ENABLE_API_LOGGING=true

# ===== CONFIGURATION AVANCÉE =====
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3
NEXT_PUBLIC_API_RETRY_DELAY=1000
NEXT_PUBLIC_API_CACHE_DURATION=300000   # 5 minutes
NEXT_PUBLIC_REQUEST_TIMEOUT=10000

# ===== CORS ET SÉCURITÉ =====
NEXT_PUBLIC_CORS_ENABLED=true
NEXT_PUBLIC_API_KEY=your-api-key-here
NEXT_PUBLIC_CSRF_PROTECTION=true
```

#### **Staging** (`.env.staging`)
```bash
NEXT_PUBLIC_API_BASE_URL=https://api-staging.valdora.com
NEXT_PUBLIC_ENABLE_MOCKS=false
NEXT_PUBLIC_ENABLE_API_LOGGING=false
NEXT_PUBLIC_API_TIMEOUT=20000
```

#### **Production** (`.env.production`)
```bash
NEXT_PUBLIC_API_BASE_URL=https://api.valdora.com
NEXT_PUBLIC_ENABLE_MOCKS=false
NEXT_PUBLIC_ENABLE_API_LOGGING=false
NEXT_PUBLIC_ENABLE_API_CACHE=true
NEXT_PUBLIC_API_TIMEOUT=15000
```

### 1.2 Validation des Variables
```javascript
// src/config/api/validation.js
export const validateApiConfig = () => {
  const required = [
    'NEXT_PUBLIC_API_BASE_URL',
    'NEXT_PUBLIC_API_VERSION'
  ]
  
  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(`Variables d'environnement manquantes: ${missing.join(', ')}`)
  }
  
  return true
}
```

## 🔧 Étape 2 : Configuration de l'API Client

### 2.1 Créer la Configuration API
```javascript
// src/config/api/config.js
export const apiConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  version: process.env.NEXT_PUBLIC_API_VERSION || 'v1',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT) || 30000,
  
  // Authentification
  auth: {
    enabled: process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true',
    tokenKey: process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || 'auth_token',
    refreshKey: process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY || 'refresh_token'
  },
  
  // Retry configuration
  retry: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_API_RETRY === 'true',
    attempts: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS) || 3,
    delay: parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY) || 1000
  },
  
  // Cache configuration
  cache: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_API_CACHE === 'true',
    duration: parseInt(process.env.NEXT_PUBLIC_API_CACHE_DURATION) || 300000
  },
  
  // Headers par défaut
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-API-Version': process.env.NEXT_PUBLIC_API_VERSION || 'v1'
  }
}

// Construire l'URL complète de l'API
export const getApiUrl = (endpoint = '') => {
  const baseUrl = apiConfig.baseURL.replace(/\/$/, '')
  const version = apiConfig.version
  const cleanEndpoint = endpoint.replace(/^\//, '')
  
  return `${baseUrl}/api/${version}/${cleanEndpoint}`
}
```

### 2.2 Créer l'Intercepteur d'Authentification
```javascript
// src/config/api/auth.js
import { apiConfig } from './config'

export class AuthManager {
  static getToken() {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(apiConfig.auth.tokenKey)
  }
  
  static setToken(token) {
    if (typeof window === 'undefined') return
    localStorage.setItem(apiConfig.auth.tokenKey, token)
  }
  
  static removeToken() {
    if (typeof window === 'undefined') return
    localStorage.removeItem(apiConfig.auth.tokenKey)
    localStorage.removeItem(apiConfig.auth.refreshKey)
  }
  
  static getAuthHeaders() {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }
  
  static async refreshToken() {
    const refreshToken = localStorage.getItem(apiConfig.auth.refreshKey)
    if (!refreshToken) throw new Error('No refresh token available')
    
    try {
      const response = await fetch(getApiUrl('auth/refresh'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      })
      
      if (!response.ok) throw new Error('Token refresh failed')
      
      const data = await response.json()
      this.setToken(data.access_token)
      
      return data.access_token
    } catch (error) {
      this.removeToken()
      throw error
    }
  }
}
```

## 🔌 Étape 3 : Configuration RTK Query

### 3.1 Créer l'API Client Principal
```javascript
// src/redux-store/services/valdoraApiClient.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { apiConfig, getApiUrl } from '../../config/api/config'
import { AuthManager } from '../../config/api/auth'

// Base query avec authentification et gestion d'erreurs
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: getApiUrl(),
  timeout: apiConfig.timeout,
  
  prepareHeaders: (headers, { getState }) => {
    // Headers par défaut
    Object.entries(apiConfig.defaultHeaders).forEach(([key, value]) => {
      headers.set(key, value)
    })
    
    // Headers d'authentification
    if (apiConfig.auth.enabled) {
      const authHeaders = AuthManager.getAuthHeaders()
      Object.entries(authHeaders).forEach(([key, value]) => {
        headers.set(key, value)
      })
    }
    
    // API Key si configurée
    if (process.env.NEXT_PUBLIC_API_KEY) {
      headers.set('X-API-Key', process.env.NEXT_PUBLIC_API_KEY)
    }
    
    return headers
  }
})

// Query avec retry et refresh token
const baseQueryWithRetry = async (args, api, extraOptions) => {
  let result = await baseQueryWithAuth(args, api, extraOptions)
  
  // Gestion du token expiré
  if (result.error?.status === 401 && apiConfig.auth.enabled) {
    try {
      await AuthManager.refreshToken()
      result = await baseQueryWithAuth(args, api, extraOptions)
    } catch (refreshError) {
      // Rediriger vers login si refresh échoue
      AuthManager.removeToken()
      window.location.href = '/login'
    }
  }
  
  // Retry en cas d'erreur réseau
  if (result.error && apiConfig.retry.enabled) {
    const { attempts, delay } = apiConfig.retry
    
    for (let i = 0; i < attempts; i++) {
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)))
      result = await baseQueryWithAuth(args, api, extraOptions)
      
      if (!result.error) break
    }
  }
  
  return result
}

// API principale
export const valdoraApi = createApi({
  reducerPath: 'valdoraApi',
  baseQuery: baseQueryWithRetry,
  
  tagTypes: [
    'Tenant',
    'User', 
    'Product',
    'Order',
    'Analytics',
    'AiStoreDraft'
  ],
  
  endpoints: (builder) => ({
    // Les endpoints seront définis dans les sections suivantes
  })
})
```

### 3.2 Endpoints pour les Tenants
```javascript
// src/redux-store/services/endpoints/tenants.js
export const tenantEndpoints = (builder) => ({
  // Récupérer tous les tenants
  getTenants: builder.query({
    query: ({ page = 1, limit = 10, search = '', status = '' } = {}) => ({
      url: 'tenants',
      params: { page, limit, search, status }
    }),
    providesTags: ['Tenant'],
    transformResponse: (response) => ({
      data: response.data || [],
      pagination: response.pagination || {},
      total: response.total || 0
    })
  }),
  
  // Récupérer un tenant par ID
  getTenantById: builder.query({
    query: (id) => `tenants/${id}`,
    providesTags: (result, error, id) => [{ type: 'Tenant', id }],
    transformResponse: (response) => response.data
  }),
  
  // Créer un nouveau tenant
  createTenant: builder.mutation({
    query: (tenantData) => ({
      url: 'tenants',
      method: 'POST',
      body: tenantData
    }),
    invalidatesTags: ['Tenant'],
    transformResponse: (response) => response.data
  }),
  
  // Mettre à jour un tenant
  updateTenant: builder.mutation({
    query: ({ id, ...tenantData }) => ({
      url: `tenants/${id}`,
      method: 'PUT',
      body: tenantData
    }),
    invalidatesTags: (result, error, { id }) => [
      { type: 'Tenant', id },
      'Tenant'
    ],
    transformResponse: (response) => response.data
  }),
  
  // Supprimer un tenant
  deleteTenant: builder.mutation({
    query: (id) => ({
      url: `tenants/${id}`,
      method: 'DELETE'
    }),
    invalidatesTags: ['Tenant']
  }),
  
  // Changer le statut d'un tenant
  updateTenantStatus: builder.mutation({
    query: ({ id, status }) => ({
      url: `tenants/${id}/status`,
      method: 'PATCH',
      body: { status }
    }),
    invalidatesTags: (result, error, { id }) => [
      { type: 'Tenant', id },
      'Tenant'
    ]
  })
})
```

### 3.3 Endpoints pour l'Authentification
```javascript
// src/redux-store/services/endpoints/auth.js
export const authEndpoints = (builder) => ({
  // Connexion
  login: builder.mutation({
    query: (credentials) => ({
      url: 'auth/login',
      method: 'POST',
      body: credentials
    }),
    transformResponse: (response) => {
      if (response.access_token) {
        AuthManager.setToken(response.access_token)
        if (response.refresh_token) {
          localStorage.setItem(apiConfig.auth.refreshKey, response.refresh_token)
        }
      }
      return response
    }
  }),
  
  // Déconnexion
  logout: builder.mutation({
    query: () => ({
      url: 'auth/logout',
      method: 'POST'
    }),
    transformResponse: (response) => {
      AuthManager.removeToken()
      return response
    }
  }),
  
  // Profil utilisateur
  getProfile: builder.query({
    query: () => 'auth/profile',
    providesTags: ['User'],
    transformResponse: (response) => response.data
  }),
  
  // Refresh token
  refreshToken: builder.mutation({
    query: (refreshToken) => ({
      url: 'auth/refresh',
      method: 'POST',
      body: { refresh_token: refreshToken }
    })
  })
})
```

## 🔄 Étape 4 : Migration des Mocks vers l'API

### 4.1 Créer un Service de Migration
```javascript
// src/config/api/migration.js
import { apiConfig } from './config'

export class ApiMigration {
  static isMockMode() {
    return process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true'
  }
  
  static async testConnection() {
    try {
      const response = await fetch(getApiUrl('health'), {
        method: 'GET',
        headers: apiConfig.defaultHeaders,
        timeout: 5000
      })
      
      return response.ok
    } catch (error) {
      console.error('API connection test failed:', error)
      return false
    }
  }
  
  static async validateEndpoints() {
    const endpoints = [
      'tenants',
      'auth/profile',
      'products',
      'orders'
    ]
    
    const results = {}
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(getApiUrl(endpoint), {
          method: 'HEAD',
          headers: apiConfig.defaultHeaders
        })
        results[endpoint] = response.ok
      } catch (error) {
        results[endpoint] = false
      }
    }
    
    return results
  }
}
```

### 4.2 Mise à Jour du Store Redux
```javascript
// src/redux-store/store.js
import { configureStore } from '@reduxjs/toolkit'
import { valdoraApi } from './services/valdoraApiClient'
import { validateApiConfig } from '../config/api/validation'

// Valider la configuration au démarrage
validateApiConfig()

export const store = configureStore({
  reducer: {
    [valdoraApi.reducerPath]: valdoraApi.reducer,
    // Autres reducers...
  },
  
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [valdoraApi.util.getRunningQueriesThunk.fulfilled]
      }
    }).concat(valdoraApi.middleware),
  
  devTools: process.env.NODE_ENV !== 'production'
})

// Types pour TypeScript
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

## 🛡️ Étape 5 : Gestion d'Erreurs et Logging

### 5.1 Intercepteur d'Erreurs
```javascript
// src/config/api/errorHandler.js
export class ApiErrorHandler {
  static handleError(error, endpoint) {
    const errorInfo = {
      endpoint,
      status: error.status,
      message: error.data?.message || error.message,
      timestamp: new Date().toISOString()
    }
    
    // Logging
    if (process.env.NEXT_PUBLIC_ENABLE_API_LOGGING === 'true') {
      console.error('API Error:', errorInfo)
    }
    
    // Gestion par type d'erreur
    switch (error.status) {
      case 400:
        return this.handleBadRequest(error)
      case 401:
        return this.handleUnauthorized(error)
      case 403:
        return this.handleForbidden(error)
      case 404:
        return this.handleNotFound(error)
      case 500:
        return this.handleServerError(error)
      default:
        return this.handleGenericError(error)
    }
  }
  
  static handleBadRequest(error) {
    return {
      type: 'validation',
      message: 'Données invalides',
      details: error.data?.errors || []
    }
  }
  
  static handleUnauthorized(error) {
    AuthManager.removeToken()
    return {
      type: 'auth',
      message: 'Session expirée, veuillez vous reconnecter',
      redirect: '/login'
    }
  }
  
  static handleServerError(error) {
    return {
      type: 'server',
      message: 'Erreur serveur, veuillez réessayer plus tard',
      retryable: true
    }
  }
}
```

### 5.2 Logger API
```javascript
// src/config/api/logger.js
export class ApiLogger {
  static log(level, message, data = {}) {
    if (process.env.NEXT_PUBLIC_ENABLE_API_LOGGING !== 'true') return
    
    const logEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      url: window.location.href
    }
    
    console[level](`[VALDORA API] ${message}`, logEntry)
    
    // Envoyer vers service de logging externe si configuré
    if (process.env.NEXT_PUBLIC_LOGGING_ENDPOINT) {
      this.sendToExternalLogger(logEntry)
    }
  }
  
  static info(message, data) {
    this.log('info', message, data)
  }
  
  static error(message, data) {
    this.log('error', message, data)
  }
  
  static warn(message, data) {
    this.log('warn', message, data)
  }
}
```

## 🧪 Étape 6 : Tests et Validation

### 6.1 Tests de Connexion
```javascript
// src/config/api/tests.js
import { ApiMigration } from './migration'
import { valdoraApi } from '../redux-store/services/valdoraApiClient'

export class ApiTests {
  static async runConnectionTests() {
    const results = {
      connection: false,
      endpoints: {},
      auth: false,
      performance: {}
    }
    
    // Test de connexion de base
    console.log('🔍 Test de connexion API...')
    results.connection = await ApiMigration.testConnection()
    
    // Test des endpoints
    console.log('🔍 Test des endpoints...')
    results.endpoints = await ApiMigration.validateEndpoints()
    
    // Test de performance
    console.log('🔍 Test de performance...')
    results.performance = await this.testPerformance()
    
    return results
  }
  
  static async testPerformance() {
    const start = performance.now()
    
    try {
      await fetch(getApiUrl('health'))
      const end = performance.now()
      
      return {
        responseTime: end - start,
        status: 'ok'
      }
    } catch (error) {
      return {
        responseTime: null,
        status: 'error',
        error: error.message
      }
    }
  }
}
```

### 6.2 Page de Diagnostic
```javascript
// src/app/api-diagnostic/page.jsx
'use client'

import { useState, useEffect } from 'react'
import { ApiTests } from '../../config/api/tests'
import { ApiMigration } from '../../config/api/migration'

const ApiDiagnosticPage = () => {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  
  const runTests = async () => {
    setLoading(true)
    try {
      const testResults = await ApiTests.runConnectionTests()
      setResults(testResults)
    } catch (error) {
      console.error('Tests failed:', error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        🔧 Diagnostic API Backend
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={runTests} 
        disabled={loading}
        sx={{ mb: 3 }}
      >
        {loading ? 'Tests en cours...' : 'Lancer les tests'}
      </Button>
      
      {results && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Connexion</Typography>
                <Chip 
                  label={results.connection ? 'OK' : 'ERREUR'}
                  color={results.connection ? 'success' : 'error'}
                />
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Performance</Typography>
                <Typography variant="body2">
                  Temps de réponse: {results.performance.responseTime}ms
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  )
}
```

## 🚀 Étape 7 : Déploiement et Configuration

### 7.1 Script de Déploiement
```bash
#!/bin/bash
# scripts/deploy-with-api.sh

echo "🚀 Déploiement VALDORA avec API Backend"

# Vérifier les variables d'environnement
if [ -z "$NEXT_PUBLIC_API_BASE_URL" ]; then
  echo "❌ NEXT_PUBLIC_API_BASE_URL non définie"
  exit 1
fi

# Désactiver les mocks
export NEXT_PUBLIC_ENABLE_MOCKS=false

# Build de production
echo "📦 Build de production..."
npm run build

# Tests de connexion API
echo "🧪 Tests de connexion API..."
npm run test:api

# Déploiement
echo "🚀 Déploiement..."
npm run deploy

echo "✅ Déploiement terminé"
```

### 7.2 Configuration Docker
```dockerfile
# Dockerfile.production
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Variables d'environnement pour la production
ENV NEXT_PUBLIC_ENABLE_MOCKS=false
ENV NEXT_PUBLIC_ENABLE_API_CACHE=true
ENV NEXT_PUBLIC_ENABLE_API_LOGGING=false

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

## 📋 Checklist de Migration

### ✅ Pré-Migration
- [ ] Backend API disponible et documenté
- [ ] Endpoints testés avec Postman/Insomnia
- [ ] Authentification configurée
- [ ] Variables d'environnement définies
- [ ] Tests de connexion réussis

### ✅ Migration
- [ ] Configuration API créée
- [ ] Endpoints RTK Query implémentés
- [ ] Gestion d'erreurs configurée
- [ ] Authentification intégrée
- [ ] Mocks désactivés
- [ ] Tests de validation passés

### ✅ Post-Migration
- [ ] Application testée en mode API
- [ ] Performance validée
- [ ] Gestion d'erreurs fonctionnelle
- [ ] Logging configuré
- [ ] Documentation mise à jour
- [ ] Équipe formée

## 🔧 Dépannage

### Problèmes Courants

#### **Erreur CORS**
```javascript
// Solution: Configurer le backend pour accepter les requêtes
// Headers requis côté backend:
Access-Control-Allow-Origin: https://your-frontend-domain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key
```

#### **Token Expiré**
```javascript
// Vérifier la configuration du refresh token
if (error.status === 401) {
  await AuthManager.refreshToken()
  // Retry la requête
}
```

#### **Timeout**
```javascript
// Augmenter le timeout dans la configuration
export const apiConfig = {
  timeout: 60000, // 60 secondes
  // ...
}
```

## 📚 Ressources Supplémentaires

### Documentation
- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JWT Authentication Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

### Outils Recommandés
- **Postman**: Test des endpoints API
- **Insomnia**: Alternative à Postman
- **React Query DevTools**: Debug des requêtes
- **Redux DevTools**: Debug du state management

---

**Guide créé le**: 22 septembre 2025  
**Version**: 1.0.0  
**Auteur**: Équipe VALDORA  
**Status**: ✅ Prêt pour implémentation
