/**
 * Configuration utilitaire pour VALDORA
 * Gère les variables d'environnement et les feature flags
 */

export const config = {
  // Mock Configuration
  mocks: {
    enabled: process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true',
    delay: parseInt(process.env.NEXT_PUBLIC_MOCK_DELAY || '1000', 10),
  },

  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  },

  // Feature Flags
  features: {
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    sidebar: process.env.NEXT_PUBLIC_ENABLE_SIDEBAR === 'true',
    notifications: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
  },

  // Development Settings
  dev: {
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
    logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL || 'info',
  },

  // Theme Configuration
  theme: {
    default: process.env.NEXT_PUBLIC_DEFAULT_THEME || 'light',
    darkModeEnabled: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === 'true',
  },
}

/**
 * Logger utilitaire basé sur la configuration
 */
export const logger = {
  debug: (...args) => {
    if (config.dev.debugMode && config.dev.logLevel === 'debug') {
      console.debug('[VALDORA DEBUG]', ...args)
    }
  },
  info: (...args) => {
    if (config.dev.debugMode) {
      console.info('[VALDORA INFO]', ...args)
    }
  },
  warn: (...args) => {
    console.warn('[VALDORA WARN]', ...args)
  },
  error: (...args) => {
    console.error('[VALDORA ERROR]', ...args)
  },
}

/**
 * Utilitaire pour simuler des délais d'API
 */
export const mockDelay = (customDelay) => {
  if (!config.mocks.enabled) return Promise.resolve()
  
  const delay = customDelay || config.mocks.delay
  return new Promise(resolve => setTimeout(resolve, delay))
}

/**
 * Vérifier si une feature est activée
 */
export const isFeatureEnabled = (featureName) => {
  return config.features[featureName] || false
}

export default config
