# Guide du Système de Navigation Dynamique VALDORA

## Vue d'Ensemble

Le système de navigation dynamique de VALDORA permet d'ajouter automatiquement de nouveaux composants au menu de navigation sans modification manuelle des fichiers de configuration. Ce système utilise des métadonnées intégrées dans les composants et des feature flags pour un contrôle granulaire.

## Architecture du Système

### Composants Principaux

| Composant | Rôle | Fichier |
|-----------|------|---------|
| **ComponentScanner** | Détection automatique des composants | `src/plugins/navigation/componentScanner.js` |
| **DynamicNavigation** | Composant React de navigation | `src/components/navigation/DynamicNavigation.jsx` |
| **useNavigationConfig** | Hook React pour la navigation | `src/hooks/useNavigationConfig.js` |
| **FeatureFlags** | Système d'activation/désactivation | `src/config/navigation/featureFlags.js` |

### Flux de Fonctionnement

1. **Scan des Composants** : Le ComponentScanner analyse tous les fichiers `.jsx` pour détecter les métadonnées `navigationConfig`
2. **Filtrage par Feature Flags** : Les composants sont filtrés selon les variables d'environnement
3. **Vérification des Permissions** : Contrôle d'accès basé sur les rôles utilisateur
4. **Génération de la Navigation** : Construction de la structure hiérarchique du menu
5. **Rendu Dynamique** : Affichage automatique dans la sidebar

## Configuration des Composants

### Métadonnées de Navigation

Chaque composant peut exporter une configuration `navigationConfig` :

```javascript
// Configuration de navigation pour la détection automatique
export const navigationConfig = {
  enabled: true,                    // Active/désactive le composant
  section: 'Administration',        // Section du menu
  label: 'Tenants',                // Libellé affiché
  icon: 'tabler-building',         // Icône Material-UI
  order: 100,                      // Ordre d'affichage (plus petit = plus haut)
  permissions: ['admin'],          // Permissions requises
  featureFlag: 'TENANTS',         // Feature flag associé
  children: [                      // Sous-menus optionnels
    { label: 'Liste des tenants', href: '/admin/tenants' },
    { label: 'Nouveau tenant', href: '/admin/tenants/new' }
  ]
}
```

### Propriétés Disponibles

| Propriété | Type | Obligatoire | Description |
|-----------|------|-------------|-------------|
| `enabled` | boolean | ✅ | Active ou désactive le composant |
| `section` | string | ❌ | Section du menu (défaut: "General") |
| `label` | string | ✅ | Texte affiché dans le menu |
| `icon` | string | ❌ | Nom de l'icône (format tabler-*) |
| `order` | number | ❌ | Ordre d'affichage (défaut: 999) |
| `permissions` | array | ❌ | Permissions requises (défaut: []) |
| `featureFlag` | string | ❌ | Feature flag pour activation conditionnelle |
| `children` | array | ❌ | Sous-éléments de navigation |

## Feature Flags

### Configuration via Variables d'Environnement

Les feature flags sont configurés dans le fichier `.env.local` :

```bash
# Feature Flags pour la navigation dynamique
NEXT_PUBLIC_FEATURE_TENANTS=true
NEXT_PUBLIC_FEATURE_ANALYTICS=true
NEXT_PUBLIC_FEATURE_DASHBOARD=true
NEXT_PUBLIC_FEATURE_AI_ASSISTANT=false
NEXT_PUBLIC_FEATURE_ADVANCED_REPORTING=false
```

### Utilisation dans les Composants

```javascript
import { useFeatureFlags } from '@/config/navigation/featureFlags'

const MyComponent = () => {
  const { isEnabled } = useFeatureFlags()
  
  if (!isEnabled('TENANTS')) {
    return <div>Module non disponible</div>
  }
  
  return <div>Contenu du module</div>
}
```

## Gestion des Permissions

### Système de Rôles

Le système supporte différents niveaux de permissions :

- **admin** : Accès administrateur complet
- **user** : Utilisateur standard
- **analyst** : Accès aux analytics
- **developer** : Outils de développement
- **premium** : Fonctionnalités premium

### Vérification des Permissions

```javascript
import { useNavigationPermissions } from '@/hooks/useNavigationConfig'

const Navigation = () => {
  const userPermissions = ['admin', 'user']
  const { filterNavigationByPermissions } = useNavigationPermissions(userPermissions)
  
  // La navigation sera automatiquement filtrée
}
```

## Ajout d'un Nouveau Composant

### Étapes Simples

1. **Créer le Composant** avec ses métadonnées :

```javascript
// src/views/mymodule/MyComponent.jsx
'use client'

// Configuration de navigation
export const navigationConfig = {
  enabled: true,
  section: 'Mon Module',
  label: 'Ma Fonctionnalité',
  icon: 'tabler-star',
  order: 50,
  permissions: ['user'],
  featureFlag: 'MY_FEATURE'
}

const MyComponent = () => {
  return <div>Mon nouveau composant</div>
}

export default MyComponent
```

2. **Configurer le Feature Flag** dans `.env.local` :

```bash
NEXT_PUBLIC_FEATURE_MY_FEATURE=true
```

3. **Créer la Route** dans `src/app/my-route/page.jsx` :

```javascript
import MyComponent from '@/views/mymodule/MyComponent'

export default function MyPage() {
  return <MyComponent />
}
```

4. **Résultat** : Le composant apparaît automatiquement dans la navigation !

## Scripts de Build

### Génération Statique

Pour la production, utilisez le script de génération statique :

```bash
npm run generate-navigation
```

Ce script :
- Scanne tous les composants
- Génère un fichier `src/data/navigation/generated.js`
- Optimise les performances en évitant le scan à l'exécution

### Intégration au Build

Ajoutez le script au `package.json` :

```json
{
  "scripts": {
    "generate-navigation": "node scripts/generateNavigation.cjs",
    "prebuild": "npm run generate-navigation",
    "build": "next build"
  }
}
```

## Avantages du Système

### Pour les Développeurs

- **Zéro Configuration Manuelle** : Ajout automatique au menu
- **Évite les Conflits** : Plus de merge conflicts sur les fichiers de navigation
- **Cohérence Garantie** : Tous les composants suivent le même pattern
- **Debugging Facile** : Configuration visible dans chaque composant

### Pour l'Équipe

- **Scalabilité** : Supporte des centaines de modules
- **Maintenance Réduite** : Moins de code à maintenir
- **Flexibilité** : Activation/désactivation à la volée
- **Sécurité** : Contrôle d'accès intégré

### Pour la Production

- **Performance Optimisée** : Navigation pré-générée
- **Cache Intelligent** : Évite les re-scans inutiles
- **Fallback Robuste** : Navigation statique en cas d'erreur
- **Hot Reload** : Mise à jour automatique en développement

## Dépannage

### Problèmes Courants

**Le composant n'apparaît pas dans le menu :**
- Vérifiez que `enabled: true`
- Contrôlez le feature flag dans `.env.local`
- Vérifiez les permissions utilisateur
- Assurez-vous que la syntaxe `navigationConfig` est correcte

**Erreur de parsing de configuration :**
- Utilisez uniquement des objets littéraux JavaScript
- Évitez les fonctions ou variables dans `navigationConfig`
- Respectez la syntaxe JSON pour les valeurs

**Performance lente :**
- Utilisez le script de génération statique pour la production
- Vérifiez le cache de navigation
- Limitez le nombre de composants scannés

## Exemples Complets

### Composant Simple

```javascript
export const navigationConfig = {
  enabled: true,
  section: 'Outils',
  label: 'Calculatrice',
  icon: 'tabler-calculator',
  order: 10
}
```

### Composant avec Sous-Menu

```javascript
export const navigationConfig = {
  enabled: true,
  section: 'E-commerce',
  label: 'Produits',
  icon: 'tabler-package',
  order: 20,
  permissions: ['admin', 'manager'],
  featureFlag: 'PRODUCTS',
  children: [
    { label: 'Liste des produits', href: '/products' },
    { label: 'Nouveau produit', href: '/products/new' },
    { label: 'Catégories', href: '/products/categories' }
  ]
}
```

### Composant Conditionnel

```javascript
export const navigationConfig = {
  enabled: process.env.NODE_ENV === 'development',
  section: 'Développement',
  label: 'Debug Tools',
  icon: 'tabler-bug',
  order: 999,
  permissions: ['developer'],
  featureFlag: 'DEBUG_TOOLS'
}
```

Ce système de navigation dynamique positionne VALDORA comme une plateforme moderne et évolutive, facilitant grandement l'ajout de nouvelles fonctionnalités par l'équipe de développement.
