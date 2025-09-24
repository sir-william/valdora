# TopNav Sticky Component - Documentation Complète

## 🎯 Vue d'ensemble

Le composant TopNav est une barre de navigation sticky responsive qui fournit un accès rapide aux fonctionnalités principales de VALDORA. Il s'intègre parfaitement avec le système de navigation existant et offre une expérience utilisateur moderne et accessible.

## ✨ Fonctionnalités Principales

### 🔍 Palette de Recherche
- **Raccourci clavier** : `Ctrl/Cmd + K`
- **Navigation clavier** : ↑↓ pour naviguer, Enter pour sélectionner, Esc pour fermer
- **Recherche temps réel** avec résultats catégorisés
- **Types de résultats** : Pages, Actions, Commandes

### 🎨 Toggle Thème
- **Trois modes** : System → Light → Dark
- **Persistance** : Sauvegarde automatique des préférences
- **Clic droit** : Toggle rapide entre Light/Dark
- **Synchronisation** : Respect des préférences système

### 🌐 Sélecteur de Langue
- **10 langues supportées** avec drapeaux et noms natifs
- **Recherche intégrée** pour trouver rapidement une langue
- **Persistance** : Sauvegarde automatique de la langue sélectionnée
- **Interface multilingue** : Support complet i18n

### 🔔 Menu Notifications
- **Badge temps réel** : Nombre de notifications non lues
- **Groupement par date** : Aujourd'hui, Hier, Cette semaine
- **Types colorés** : Info (bleu), Succès (vert), Avertissement (orange), Erreur (rouge)
- **Actions** : Marquer tout comme lu, voir toutes les notifications

### 👤 Menu Utilisateur
- **Informations utilisateur** : Nom, email, rôle, statut en ligne
- **Sections** : Profil, Paramètres, Facturation, Tarification, FAQ, Déconnexion
- **Badges d'alerte** : Notifications de facturation et autres alertes
- **Dernière connexion** : Affichage de la date/heure

## 📱 Design Responsive

### Desktop (≥1024px)
- **Hauteur** : 64px
- **Affichage complet** : Tous les éléments visibles
- **Recherche** : Barre de recherche complète avec placeholder
- **Actions** : Toutes les icônes d'action visibles

### Tablet (768-1024px)
- **Hauteur** : 60px
- **Recherche** : Max-width ~420px
- **Menu overflow** : Certaines actions dans un menu déroulant
- **Adaptation** : Espacement optimisé

### Mobile (<768px)
- **Hauteur** : 56px
- **Éléments essentiels** : Logo + icône recherche + 2-3 icônes max
- **Menu hamburger** : Actions secondaires dans un menu
- **Touch-friendly** : Cibles tactiles ≥44×44px

## 🔌 Intégration API

### Services Mock Intégrés
```javascript
// RTK Query API Endpoints
GET /me                              // Données utilisateur
GET /notifications                   // Liste des notifications
PATCH /notifications/mark-all-read   // Marquer comme lues
GET /billing/alerts                  // Alertes de facturation
POST /auth/logout                    // Déconnexion
```

### Configuration Redux
```javascript
// store.js
import { topNavApi } from '@/redux-store/services/topNavApi'

export const store = configureStore({
  reducer: {
    [topNavApi.reducerPath]: topNavApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(topNavApi.middleware),
})
```

## ♿ Accessibilité (WCAG 2.1 AA)

### Contraste et Visibilité
- **Contraste minimum** : 4.5:1 pour le texte normal
- **Contraste amélioré** : 7:1 pour les éléments importants
- **Indicateurs visuels** : États focus, hover, active clairement définis

### Navigation Clavier
- **Tab** : Navigation séquentielle entre les éléments
- **Esc** : Fermeture des menus et modales
- **Enter/Space** : Activation des boutons et liens
- **Flèches** : Navigation dans les listes et menus

### ARIA et Sémantique
```jsx
// Exemples d'implémentation ARIA
<button aria-label="Toggle theme" aria-expanded="false">
<div role="menu" aria-labelledby="user-menu-button">
<input aria-describedby="search-help" placeholder="Search...">
```

### Cibles Tactiles
- **Taille minimum** : 44×44px pour tous les éléments interactifs
- **Espacement** : 8px minimum entre les cibles tactiles
- **Zone de frappe** : Optimisée pour les doigts et le pouce

## 🧪 Tests et Qualité

### Tests Automatisés
```bash
# Tests unitaires
npm run test:unit

# Tests d'intégration
npm run test:integration

# Tests d'accessibilité
npm run test:a11y
```

### Tests Manuels
1. **Fonctionnalité** : Tous les composants interactifs
2. **Responsive** : Redimensionnement de la fenêtre
3. **Clavier** : Navigation complète au clavier
4. **Écran lecteur** : Compatibilité NVDA/JAWS
5. **Performance** : Temps de chargement <100ms

### Métriques de Performance
- **First Contentful Paint** : <1.2s
- **Largest Contentful Paint** : <2.5s
- **Cumulative Layout Shift** : <0.1
- **First Input Delay** : <100ms

## 🚀 Déploiement et Configuration

### Variables d'Environnement
```bash
# .env.local
NEXT_PUBLIC_ENABLE_MOCKS=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_FEATURE_TOPNAV=true
```

### Build et Déploiement
```bash
# Build de production
npm run build

# Vérification des types
npm run type-check

# Linting et formatage
npm run lint
npm run format
```

## 📚 Utilisation et Exemples

### Intégration de Base
```jsx
import { TopNav } from '@/components/layout/TopNav'

function Layout({ children }) {
  return (
    <div>
      <TopNav />
      <main>{children}</main>
    </div>
  )
}
```

### Personnalisation
```jsx
<TopNav
  showSearch={true}
  showNotifications={true}
  showUserMenu={true}
  theme="system"
  language="fr"
/>
```

### Hooks Utilitaires
```jsx
import { useTopNavNotifications, useTopNavUser } from '@/hooks/topnav'

function MyComponent() {
  const { notifications, markAllAsRead } = useTopNavNotifications()
  const { user, logout } = useTopNavUser()
  
  return (
    // Votre composant
  )
}
```

## 🔧 Maintenance et Évolution

### Structure des Fichiers
```
src/components/layout/
├── TopNav.jsx                 # Composant principal
├── topnav/
│   ├── ThemeToggle.jsx       # Toggle thème
│   ├── LanguageSelector.jsx  # Sélecteur langue
│   ├── NotificationsMenu.jsx # Menu notifications
│   ├── UserMenu.jsx          # Menu utilisateur
│   └── SearchPalette.jsx     # Palette recherche
├── services/
│   └── topNavApi.js          # API RTK Query
└── hooks/
    └── useTopNav.js          # Hooks utilitaires
```

### Ajout de Nouvelles Fonctionnalités
1. **Créer le sous-composant** dans `/topnav/`
2. **Ajouter les services API** si nécessaire
3. **Intégrer dans TopNav.jsx**
4. **Ajouter les tests**
5. **Mettre à jour la documentation**

### Bonnes Pratiques
- **Composants atomiques** : Un composant = une responsabilité
- **Props typées** : Utilisation de PropTypes ou TypeScript
- **Memoization** : React.memo pour les performances
- **Lazy loading** : Chargement différé des menus
- **Error boundaries** : Gestion des erreurs gracieuse

## 📊 Métriques et Monitoring

### Métriques Utilisateur
- **Taux d'utilisation** : Recherche, notifications, thème
- **Temps de réponse** : Interactions utilisateur
- **Erreurs** : Taux d'erreur par fonctionnalité

### Monitoring Technique
- **Bundle size** : Taille du composant TopNav
- **Render time** : Temps de rendu initial
- **Memory usage** : Utilisation mémoire
- **API calls** : Fréquence et performance des appels

## 🆘 Dépannage

### Problèmes Courants

**Q: La recherche ne fonctionne pas**
A: Vérifiez que `NEXT_PUBLIC_ENABLE_MOCKS=true` et que l'API est accessible

**Q: Les notifications ne se mettent pas à jour**
A: Vérifiez la configuration RTK Query et les tags de cache

**Q: Le thème ne persiste pas**
A: Vérifiez le localStorage et les cookies de préférences

**Q: Problème de responsive**
A: Testez les breakpoints Material-UI et les media queries

### Support et Contact
- **Documentation** : `/topnav-demo` pour les tests interactifs
- **Issues GitHub** : https://github.com/sir-william/valdora/issues
- **Équipe** : @frontend-team pour les questions techniques

---

*Documentation générée le 23 septembre 2025 - Version 1.0.0*
