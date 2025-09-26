/**
 * Système de Feature Flags pour VALDORA
 * Permet l'activation/désactivation dynamique des fonctionnalités
 */

// Configuration des feature flags depuis les variables d'environnement
const featureFlags = {
  // Fonctionnalités IA
  AI_GENERATION: process.env.NEXT_PUBLIC_FEATURE_AI_GENERATION === 'true',
  AI_DRAFTS: process.env.NEXT_PUBLIC_FEATURE_AI_DRAFTS === 'true',
  
  // Analytics et Dashboard
  ANALYTICS: process.env.NEXT_PUBLIC_FEATURE_ANALYTICS === 'true',
  ADVANCED_ANALYTICS: process.env.NEXT_PUBLIC_FEATURE_ADVANCED_ANALYTICS === 'true',
  
  // E-commerce
  PRODUCTS: process.env.NEXT_PUBLIC_FEATURE_PRODUCTS === 'true',
  ORDERS: process.env.NEXT_PUBLIC_FEATURE_ORDERS === 'true',
  INVENTORY: process.env.NEXT_PUBLIC_FEATURE_INVENTORY === 'true',
  
  // Administration
  TENANTS: process.env.NEXT_PUBLIC_FEATURE_TENANTS === 'true',
  USER_MANAGEMENT: process.env.NEXT_PUBLIC_FEATURE_USER_MANAGEMENT === 'true',
  ROLES_PERMISSIONS: process.env.NEXT_PUBLIC_FEATURE_ROLES_PERMISSIONS === 'true',
  
  // Démonstration et Tests
  DEMO_COMPONENTS: process.env.NEXT_PUBLIC_FEATURE_DEMO_COMPONENTS === 'true',
  API_TEST: process.env.NEXT_PUBLIC_FEATURE_API_TEST === 'true',
  
  // Fonctionnalités avancées
  NOTIFICATIONS: process.env.NEXT_PUBLIC_FEATURE_NOTIFICATIONS === 'true',
  REAL_TIME: process.env.NEXT_PUBLIC_FEATURE_REAL_TIME === 'true',
  EXPORT_DATA: process.env.NEXT_PUBLIC_FEATURE_EXPORT_DATA === 'true',
  
  // Mocks et développement
  ENABLE_MOCKS: process.env.NEXT_PUBLIC_ENABLE_MOCKS === 'true',
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
}

/**
 * Vérifie si une fonctionnalité est activée
 * @param {string} flagName - Nom du feature flag
 * @returns {boolean} - True si la fonctionnalité est activée
 */
export const isFeatureEnabled = (flagName) => {
  return featureFlags[flagName] === true
}

/**
 * Vérifie si plusieurs fonctionnalités sont activées
 * @param {string[]} flagNames - Tableau des noms de feature flags
 * @returns {boolean} - True si toutes les fonctionnalités sont activées
 */
export const areAllFeaturesEnabled = (flagNames) => {
  return flagNames.every(flagName => isFeatureEnabled(flagName))
}

/**
 * Vérifie si au moins une fonctionnalité est activée
 * @param {string[]} flagNames - Tableau des noms de feature flags
 * @returns {boolean} - True si au moins une fonctionnalité est activée
 */
export const isAnyFeatureEnabled = (flagNames) => {
  return flagNames.some(flagName => isFeatureEnabled(flagName))
}

/**
 * Retourne la liste de toutes les fonctionnalités activées
 * @returns {string[]} - Tableau des noms des fonctionnalités activées
 */
export const getEnabledFeatures = () => {
  return Object.keys(featureFlags).filter(flagName => featureFlags[flagName])
}

/**
 * Retourne la liste de toutes les fonctionnalités désactivées
 * @returns {string[]} - Tableau des noms des fonctionnalités désactivées
 */
export const getDisabledFeatures = () => {
  return Object.keys(featureFlags).filter(flagName => !featureFlags[flagName])
}

/**
 * Retourne toutes les feature flags avec leur statut
 * @returns {Object} - Objet contenant tous les feature flags
 */
export const getAllFeatureFlags = () => {
  return { ...featureFlags }
}

/**
 * Hook React pour utiliser les feature flags
 * @param {string} flagName - Nom du feature flag
 * @returns {boolean} - True si la fonctionnalité est activée
 */
export const useFeatureFlag = (flagName) => {
  return isFeatureEnabled(flagName)
}

/**
 * Composant HOC pour conditionner l'affichage selon un feature flag
 * @param {string} flagName - Nom du feature flag
 * @param {React.Component} Component - Composant à afficher si activé
 * @param {React.Component} FallbackComponent - Composant à afficher si désactivé (optionnel)
 * @returns {React.Component} - Composant conditionnel
 */
export const withFeatureFlag = (flagName, Component, FallbackComponent = null) => {
  return (props) => {
    if (isFeatureEnabled(flagName)) {
      return <Component {...props} />
    }
    
    if (FallbackComponent) {
      return <FallbackComponent {...props} />
    }
    
    return null
  }
}

/**
 * Composant React pour conditionner l'affichage selon un feature flag
 * @param {Object} props - Props du composant
 * @param {string} props.flag - Nom du feature flag
 * @param {React.ReactNode} props.children - Contenu à afficher si activé
 * @param {React.ReactNode} props.fallback - Contenu à afficher si désactivé (optionnel)
 * @returns {React.Component} - Composant conditionnel
 */
export const FeatureFlag = ({ flag, children, fallback = null }) => {
  if (isFeatureEnabled(flag)) {
    return children
  }
  
  return fallback
}

/**
 * Configuration des feature flags par défaut pour le développement
 */
export const defaultFeatureFlags = {
  AI_GENERATION: true,
  AI_DRAFTS: true,
  ANALYTICS: true,
  ADVANCED_ANALYTICS: true,
  PRODUCTS: true,
  ORDERS: true,
  INVENTORY: true,
  TENANTS: true,
  USER_MANAGEMENT: true,
  ROLES_PERMISSIONS: false,
  DEMO_COMPONENTS: true,
  API_TEST: true,
  NOTIFICATIONS: false,
  REAL_TIME: false,
  EXPORT_DATA: true,
  ENABLE_MOCKS: true,
  DEBUG_MODE: false,
}

/**
 * Utilitaire pour générer un fichier .env.local avec les feature flags
 * @param {Object} flags - Objet des feature flags à activer/désactiver
 * @returns {string} - Contenu du fichier .env.local
 */
export const generateEnvFile = (flags = defaultFeatureFlags) => {
  const envContent = Object.entries(flags)
    .map(([key, value]) => `NEXT_PUBLIC_FEATURE_${key}=${value}`)
    .join('\n')
  
  return `# Feature Flags pour VALDORA
# Généré automatiquement - Modifiez selon vos besoins

${envContent}

# Configuration API
NEXT_PUBLIC_API_BASE_URL=https://8000-ixcibwvst312itne63t09-5050bf6c.manusvm.computer

# Mocks et développement
NEXT_PUBLIC_ENABLE_MOCKS=true
NEXT_PUBLIC_DEBUG_MODE=false
`
}

export default featureFlags
