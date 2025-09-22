/**
 * Système de feature flags pour la navigation dynamique
 * Permet d'activer/désactiver des composants via configuration
 */

// Configuration des feature flags depuis les variables d'environnement
const getFeatureFlag = (key, defaultValue = false) => {
  if (typeof window !== 'undefined') {
    // Côté client - utiliser les variables d'environnement Next.js
    return process.env[`NEXT_PUBLIC_FEATURE_${key.toUpperCase()}`] === 'true' || defaultValue;
  } else {
    // Côté serveur
    return process.env[`FEATURE_${key.toUpperCase()}`] === 'true' || defaultValue;
  }
};

// Configuration des feature flags
export const featureFlags = {
  // Modules principaux
  TENANTS: getFeatureFlag('TENANTS', true),
  ANALYTICS: getFeatureFlag('ANALYTICS', true),
  DASHBOARD: getFeatureFlag('DASHBOARD', true),
  
  // Modules expérimentaux
  AI_ASSISTANT: getFeatureFlag('AI_ASSISTANT', false),
  ADVANCED_REPORTING: getFeatureFlag('ADVANCED_REPORTING', false),
  MULTI_TENANT_ADMIN: getFeatureFlag('MULTI_TENANT_ADMIN', false),
  
  // Modules de développement
  DEBUG_TOOLS: getFeatureFlag('DEBUG_TOOLS', process.env.NODE_ENV === 'development'),
  TEST_COMPONENTS: getFeatureFlag('TEST_COMPONENTS', process.env.NODE_ENV === 'development'),
  
  // Permissions et rôles
  ADMIN_PANEL: getFeatureFlag('ADMIN_PANEL', true),
  USER_MANAGEMENT: getFeatureFlag('USER_MANAGEMENT', true),
  BILLING_MODULE: getFeatureFlag('BILLING_MODULE', false),
};

// Fonction pour vérifier si un feature flag est activé
export const isFeatureEnabled = (featureName) => {
  return featureFlags[featureName.toUpperCase()] === true;
};

// Fonction pour vérifier les permissions utilisateur
export const hasPermission = (userPermissions = [], requiredPermissions = []) => {
  if (requiredPermissions.length === 0) return true;
  return requiredPermissions.some(permission => userPermissions.includes(permission));
};

// Fonction pour filtrer les éléments de navigation selon les feature flags et permissions
export const filterNavigationByFeatures = (navigationItems, userPermissions = []) => {
  return navigationItems.filter(item => {
    // Vérifier les feature flags
    if (item.featureFlag && !isFeatureEnabled(item.featureFlag)) {
      return false;
    }
    
    // Vérifier les permissions
    if (item.permissions && !hasPermission(userPermissions, item.permissions)) {
      return false;
    }
    
    // Filtrer récursivement les enfants
    if (item.children) {
      item.children = filterNavigationByFeatures(item.children, userPermissions);
    }
    
    return true;
  });
};

// Configuration des modules avec leurs feature flags
export const moduleConfig = {
  tenants: {
    enabled: isFeatureEnabled('TENANTS'),
    permissions: ['admin'],
    routes: ['/admin/tenants', '/admin/tenants/new', '/admin/tenants/[id]'],
    description: 'Gestion des tenants et organisations'
  },
  
  analytics: {
    enabled: isFeatureEnabled('ANALYTICS'),
    permissions: ['admin', 'analyst'],
    routes: ['/analytics', '/analytics/reports'],
    description: 'Tableaux de bord et analyses'
  },
  
  dashboard: {
    enabled: isFeatureEnabled('DASHBOARD'),
    permissions: [],
    routes: ['/dashboard'],
    description: 'Tableau de bord principal'
  },
  
  aiAssistant: {
    enabled: isFeatureEnabled('AI_ASSISTANT'),
    permissions: ['premium'],
    routes: ['/ai-assistant'],
    description: 'Assistant IA intégré'
  },
  
  debugTools: {
    enabled: isFeatureEnabled('DEBUG_TOOLS'),
    permissions: ['developer'],
    routes: ['/debug', '/test'],
    description: 'Outils de développement et debug'
  }
};

// Fonction pour obtenir la configuration d'un module
export const getModuleConfig = (moduleName) => {
  return moduleConfig[moduleName] || null;
};

// Fonction pour vérifier si un module est accessible
export const isModuleAccessible = (moduleName, userPermissions = []) => {
  const config = getModuleConfig(moduleName);
  if (!config) return false;
  
  return config.enabled && hasPermission(userPermissions, config.permissions);
};

// Hook pour utiliser les feature flags dans les composants React
export const useFeatureFlags = () => {
  return {
    flags: featureFlags,
    isEnabled: isFeatureEnabled,
    hasPermission,
    getModuleConfig,
    isModuleAccessible
  };
};

// Configuration par défaut pour les nouveaux composants
export const defaultNavigationConfig = {
  enabled: true,
  section: 'General',
  order: 999,
  permissions: [],
  featureFlag: null,
  icon: 'tabler-circle',
  children: []
};

// Fonction pour merger la configuration par défaut avec la configuration du composant
export const mergeNavigationConfig = (componentConfig) => {
  return {
    ...defaultNavigationConfig,
    ...componentConfig
  };
};
