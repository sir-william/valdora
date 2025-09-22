/**
 * Hook React pour la gestion de la navigation dynamique
 * Utilise le ComponentScanner pour générer la navigation en temps réel
 */

import { useState, useEffect, useMemo } from 'react';
import ComponentScanner from '@/plugins/navigation/componentScanner';

// Cache global pour éviter les re-scans inutiles
let globalNavigationCache = null;
let lastScanTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en développement

export const useNavigationConfig = (options = {}) => {
  const [navigation, setNavigation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const scanner = useMemo(() => new ComponentScanner(options), [options]);

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

        // Scanner les composants
        const components = await scanner.scanComponents();
        const structure = scanner.generateNavigationStructure(components);

        // Mettre à jour le cache global
        globalNavigationCache = structure;
        lastScanTime = now;

        setNavigation(structure);
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
  }, [scanner]);

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
