/**
 * Hook React pour la gestion de la navigation dynamique
 * Utilise une configuration statique pour éviter les erreurs côté client
 */

import { useState, useEffect, useMemo } from 'react';

// Cache global pour éviter les re-scans inutiles
let globalNavigationCache = null;
let lastScanTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en développement

export const useNavigationConfig = (options = {}) => {
  const [navigation, setNavigation] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNavigation = async () => {
      try {
        setLoading(true);
        setError(null);

        // Vérifier le cache global
        const now = Date.now();
        if (globalNavigationCache && (now - lastScanTime) < CACHE_DURATION) {
          setNavigation(globalNavigationCache);
          setLoading(false);
          return;
        }

        // Configuration statique des composants détectés
        const detectedComponents = [
          {
            id: 'home',
            label: 'Accueil',
            href: '/',
            icon: 'tabler-smart-home',
            section: 'Principal',
            order: 10,
            enabled: true
          },
          {
            id: 'dashboard',
            label: 'Dashboard',
            href: '/dashboard',
            icon: 'tabler-dashboard',
            section: 'Principal',
            order: 20,
            enabled: true
          },
          {
            id: 'products',
            label: 'Produits',
            href: '/products',
            icon: 'tabler-package',
            section: 'E-commerce',
            order: 30,
            enabled: process.env.NEXT_PUBLIC_FEATURE_PRODUCTS !== 'false',
            badge: { label: 'Auto-détecté', color: 'success' }
          },
          {
            id: 'tenants',
            label: 'Tenants',
            href: '/admin/tenants',
            icon: 'tabler-building',
            section: 'Administration',
            order: 40,
            enabled: process.env.NEXT_PUBLIC_FEATURE_TENANTS !== 'false',
            badge: { label: 'Auto-détecté', color: 'success' },
            children: [
              {
                label: 'Liste des tenants',
                href: '/admin/tenants'
              },
              {
                label: 'Nouveau tenant',
                href: '/admin/tenants/new'
              }
            ]
          },
          {
            id: 'user-management',
            label: 'Gestion Utilisateurs',
            href: '/admin/user-management',
            icon: 'tabler-users-group',
            section: 'Administration',
            order: 50,
            enabled: process.env.NEXT_PUBLIC_FEATURE_USER_ROLE_PERMISSION !== 'false',
            badge: { label: 'Auto-détecté', color: 'success' },
            children: [
              {
                label: 'Utilisateurs',
                href: '/admin/user-management/users'
              },
              {
                label: 'Rôles',
                href: '/admin/user-management/roles'
              },
              {
                label: 'Permissions',
                href: '/admin/user-management/permissions'
              }
            ]
          },
          {
            id: 'responsive-demo',
            label: 'Demo Responsive',
            href: '/responsive-demo',
            icon: 'tabler-device-mobile',
            section: 'Démonstration',
            order: 75,
            enabled: true,
            badge: { label: 'Test', color: 'info' }
          },
          {
            id: 'demo-navigation',
            label: 'Navigation Auto-Détection',
            href: '/demo-navigation',
            icon: 'tabler-magic',
            section: 'Démonstration',
            order: 70,
            enabled: true,
            badge: { label: 'Nouveau', color: 'primary' }
          }
        ]

        // Filtrer les composants activés
        const enabledComponents = detectedComponents.filter(component => component.enabled)

        // Grouper par section et trier par ordre
        const groupedBySection = enabledComponents.reduce((acc, component) => {
          const section = component.section || 'Autres'
          if (!acc[section]) {
            acc[section] = []
          }
          acc[section].push(component)
          return acc
        }, {})

        // Trier chaque section par ordre
        Object.keys(groupedBySection).forEach(section => {
          groupedBySection[section].sort((a, b) => a.order - b.order)
        })

        // Mettre à jour le cache global
        globalNavigationCache = groupedBySection;
        lastScanTime = now;

        setNavigation(groupedBySection);
      } catch (err) {
        console.error('Erreur lors du chargement de la navigation:', err);
        setError(err.message);
        
        // Fallback vers la navigation statique en cas d'erreur
        const fallbackNavigation = await loadFallbackNavigation();
        setNavigation(fallbackNavigation);
      } finally {
        setLoading(false);
      }
    };

    loadNavigation();
  }, []);

  return { navigation, loading, error, refresh: () => {
    globalNavigationCache = null;
    lastScanTime = 0;
  }};
};

/**
 * Navigation de fallback en cas d'erreur du scanner
 */
const loadFallbackNavigation = async () => {
  try {
    // Importer la navigation statique comme fallback
    const { default: staticNavigation } = await import('@/data/navigation/verticalMenuData');
    return typeof staticNavigation === 'function' ? staticNavigation() : staticNavigation;
  } catch (error) {
    console.warn('Impossible de charger la navigation de fallback:', error);
    return [];
  }
};

/**
 * Hook pour vérifier les permissions d'un élément de navigation
 */
export const useNavigationPermissions = (userPermissions = []) => {
  const checkPermissions = (item) => {
    if (!item.permissions || item.permissions.length === 0) return true;
    return item.permissions.some(permission => userPermissions.includes(permission));
  };

  const filterNavigationByPermissions = (navigation) => {
    return navigation.map(section => ({
      ...section,
      items: section.items?.filter(checkPermissions) || []
    })).filter(section => section.items.length > 0);
  };

  return { checkPermissions, filterNavigationByPermissions };
};

/**
 * Hook pour la recherche dans la navigation
 */
export const useNavigationSearch = (navigation, searchTerm = '') => {
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return navigation;

    const term = searchTerm.toLowerCase();
    const results = [];

    navigation.forEach(section => {
      const matchingItems = section.items?.filter(item => 
        item.label.toLowerCase().includes(term) ||
        item.href.toLowerCase().includes(term) ||
        (item.children && item.children.some(child => 
          child.label.toLowerCase().includes(term)
        ))
      ) || [];

      if (matchingItems.length > 0) {
        results.push({
          ...section,
          items: matchingItems
        });
      }
    });

    return results;
  }, [navigation, searchTerm]);

  return searchResults;
};
